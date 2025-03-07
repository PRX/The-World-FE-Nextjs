const pinoLogger = require('pino');

const deploymentEnv = process.env.NODE_ENV || 'development';

const logger = (defaultConfig) =>
  pinoLogger({
    ...defaultConfig,
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
      ...pinoLogger.stdSerializers,
      err: (e) => {
        const err = pinoLogger.stdSerializers.err(e);

        if (e.req) {
          err.req = pinoLogger.stdSerializers.req(e.req);
        }

        switch (err.type) {
          case 'ApolloError':
            // Remove stack from ApolloErrors. They are always from the same place and bloat log.
            delete err.stack;
            break;

          default:
            // Convert stack to an array to help with readability when parsed.
            // TODO: Evaluate usefulness of callstack from compiled production code.
            // May just remove it from logs if not useful. Dev environment will
            // show call stack on Nextjs error dialogs.
            err.stack = err?.stack.split(/\n\s*/g);
        }

        return err;
      }
    },
    timestamp: pinoLogger.stdTimeFunctions.isoTime,
    redact: [
      'cookie',
      'cookies',
      'req.cookie',
      'req.cookies',
      'req.*.cookie',
      'req.*.cookies'
    ]
  });

module.exports = {
  logger
};
