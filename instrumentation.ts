/**
 * instrumentation.ts
 *
 * Refactors next-logger to be inlined into this file.
 * Required for Amplify deployments, since next-logger looses access to custom logger configuration.
 *
 * @see     https://github.com/sainsburys-tech/next-logger/tree/main
 * @author  Chris Atkin <christopher.atkin@sainsburys.co.uk>
 *
 * */
import { format } from 'util';
import { prefixes as nextLoggerPrefixes } from 'next/dist/build/output/log';
import pino from 'pino';

type NextMethod = keyof typeof nextLoggerPrefixes;

const consoleMethods = ['log', 'debug', 'info', 'warn', 'error'] as const;
type ConsoleMethod = (typeof consoleMethods)[number][0];

const deploymentEnv = process.env.NODE_ENV || 'development';

const logger = pino({
  // Default config from next-logger.
  hooks: {
    // https://getpino.io/#/docs/api?id=logmethod
    logMethod(args, method) {
      if (args.length < 2) {
        // If there's only 1 argument passed to the log method, use Pino's default behavior.
        return method.apply(this, args);
      }

      if (typeof args[0] === 'object' && typeof args[1] === 'string') {
        // If the first argument is an object, and the second is a string, we assume that it's a merging
        // object and message, followed by interpolation values.
        // This matches Pino's logger signature, so use the default behavior.
        return method.apply(this, args);
      }

      if (typeof args[0] === 'string' && typeof args[1] === 'object') {
        // If the first argument is a string, and the second is an object, swap them round to use the object
        // as a merging object for Pino.
        const arg1 = args.shift();
        const arg2 = args.shift();
        return method.apply(this, [arg2, arg1, ...args]);
      }

      if (args.every((arg) => typeof arg === 'string')) {
        // If every argument is a string, we assume they should be concatenated together.
        // This is to support the existing behavior of console, where multiple string arguments are concatenated into a single string.
        return method.apply(this, [format(...args)]);
      }

      // If the arguments can't be changed to match Pino's signature, collapse them into a single merging object.
      const messageParts: any[] = [];
      const mergingObject = {};

      [...args].forEach((arg: any) => {
        if (Object.prototype.toString.call(arg) === '[object Error]') {
          // If the arg is an error, add it to the merging object in the same format Pino would.
          Object.assign(mergingObject, { err: arg, msg: arg.message });
        } else if (typeof arg === 'object') {
          // If the arg is an object, assign it's properties to the merging object.
          Object.assign(mergingObject, arg);
        } else {
          // Otherwise push it's value into an array for concatenation into a string.
          messageParts.push(arg);
        }
      });

      // Concatenate non-object arguments into a single string message.
      const message =
        messageParts.length > 0 ? format(...messageParts) : undefined;

      return method.apply(this, [mergingObject, message]);
    }
  },

  // Custom logger config props.
  ...(deploymentEnv !== 'production' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true
      }
    }
  }),
  level: deploymentEnv === 'production' ? 'info' : 'debug',
  serializers: {
    ...pino.stdSerializers,
    err: (e) => {
      const { stack, ...err } = pino.stdSerializers.err(e);
      return {
        ...err,
        ...(err.type !== 'ApolloError' && {
          stack: stack.split(/\n\s*/g)
        }),
        ...(e.req && { req: pino.stdSerializers.req(e.req) })
      };
    }
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: [
    'cookie',
    'cookies',
    'req.cookie',
    'req.cookies',
    'req.*.cookie',
    'req.*.cookies'
  ]
});

const getConsoleLogMethod = (consoleMethod: ConsoleMethod) => {
  const childLogger = logger.child({ name: 'console' });

  switch (consoleMethod) {
    case 'error':
      return childLogger.error.bind(childLogger);
    case 'warn':
      return childLogger.warn.bind(childLogger);
    case 'debug':
      return childLogger.debug.bind(childLogger);
    case 'log':
    case 'info':
    default:
      return childLogger.info.bind(childLogger);
  }
};

const getNextLogMethod = (nextMethod: NextMethod) => {
  const childLogger = logger.child({ name: 'next.js', prefix: nextMethod });

  switch (nextMethod) {
    case 'error':
      return childLogger.error.bind(childLogger);
    case 'warn':
      return childLogger.warn.bind(childLogger);
    case 'trace':
      return childLogger.trace.bind(childLogger);
    default:
      return childLogger.info.bind(childLogger);
  }
};

export async function register() {
  const cachePath = require.resolve('next/dist/build/output/log');
  const cacheObject = require.cache[cachePath];

  if (cacheObject) {
    // This is required to forcibly redefine all properties on the logger.
    // From Next 13 and onwards they're defined as non-configurable, preventing them from being patched.
    cacheObject.exports = { ...cacheObject.exports };

    Object.keys(nextLoggerPrefixes).forEach((method: NextMethod) => {
      Object.defineProperty(cacheObject.exports, method, {
        value: getNextLogMethod(method)
      });
    });
  }

  consoleMethods.forEach((method) => {
    // eslint-disable-next-line no-console
    console[method] = getConsoleLogMethod(method);
  });
}
