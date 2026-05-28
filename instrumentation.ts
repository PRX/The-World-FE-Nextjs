import type { Instrumentation } from "next";
import { LogLayer, type ILogLayer } from "loglayer";
import { PinoTransport } from "@loglayer/transport-pino";
import pino from "pino";
import { serializeError } from "serialize-error";

const deploymentEnv = process.env.NODE_ENV || "development";

function stripAnsiCodes(str: string): string {
  // This regex matches all ANSI escape sequences that next.js likes to put in the console logs
  return str.replace(
    // biome-ignore lint/suspicious/noControlCharactersInRegex: Needed for this match.
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    "",
  );
}

function createConsoleMethod(
  log: ILogLayer,
  method: "error" | "info" | "warn" | "debug" | "log",
) {
  let mappedMethod: "error" | "info" | "warn" | "debug";

  if (method === "log") {
    mappedMethod = "info";
  } else {
    mappedMethod = method;
  }

  return (...args: unknown[]) => {
    const data: Record<string, unknown> = {};
    let hasData = false;
    let error: Error | null = null;
    const messages: string[] = [];

    for (const arg of args) {
      if (arg instanceof Error) {
        error = arg;
        continue;
      }

      if (typeof arg === "object" && arg !== null) {
        Object.assign(data, arg);
        hasData = true;
        continue;
      }

      if (typeof arg === "string") {
        messages.push(arg);
      }
    }

    let finalMessage = stripAnsiCodes(messages.join(" ")).trim();

    // next.js uses an "x" for the error message when it's an error object
    if (finalMessage === "⨯" && error) {
      finalMessage = error?.message || "";
    }

    if (error && hasData && messages.length > 0) {
      log.withError(error).withMetadata(data)[mappedMethod](finalMessage);
    } else if (error && messages.length > 0) {
      log.withError(error)[mappedMethod](finalMessage);
    } else if (hasData && messages.length > 0) {
      log.withMetadata(data)[mappedMethod](finalMessage);
    } else if (error && hasData && messages.length === 0) {
      log.withError(error).withMetadata(data)[mappedMethod]("");
    } else if (error && messages.length === 0) {
      log.errorOnly(error);
    } else if (hasData && messages.length === 0) {
      log.metadataOnly(data);
    } else {
      log[mappedMethod](finalMessage);
    }
  };
}

export async function register() {
  const logger = new LogLayer({
    errorSerializer: serializeError,
    transport: [
      new PinoTransport({
        logger: pino({
          ...(deploymentEnv === "development" && {
            transport: {
              target: "pino-pretty",
              options: {
                colorize: true,
              },
            },
          }),
        }),
      }),
    ],
  });

  if (process.env.NEXT_RUNTIME === "nodejs") {
    console.error = createConsoleMethod(logger, "error");
    console.log = createConsoleMethod(logger, "log");
    console.info = createConsoleMethod(logger, "info");
    console.warn = createConsoleMethod(logger, "warn");
    console.debug = createConsoleMethod(logger, "debug");
  }
}

export const onRequestError: Instrumentation.onRequestError = async (
  err,
  request,
  context,
) => {
  console.error(err, request, context);
};
