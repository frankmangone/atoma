import { createLogger, format, transports as winstonTransports } from 'winston';

const { NODE_ENV, APP_NAME } = process.env;

// Any environment that isn't local is considered a production-like environment
// Logs are tracked through OpenSearch
const isProduction = NODE_ENV !== 'local' && NODE_ENV !== 'development';

const levels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
};

let transports: winstonTransports.ConsoleTransportInstance;
let defaultMeta: any;

if (APP_NAME) {
  defaultMeta = { service: APP_NAME };
}

if (isProduction) {
  // Filter out some keys in `value`
  const customFormatter = format.printf((data) => {
    if (!data.value) {
      return JSON.stringify(data);
    }

    const { value, ...baseData } = data;
    const { traceId, spanId, data: extraData } = value;

    return JSON.stringify({ ...baseData, traceId, spanId, data: extraData });
  });

  transports = new winstonTransports.Console({
    format: format.combine(format.timestamp(), format.json(), customFormatter),
  });
} else {
  transports = new winstonTransports.Console({
    format: format.combine(
      format.simple(),
      format.colorize(),
      format.timestamp(),
      format.printf(
        ({ service, context, timestamp, level, message, data }) =>
          `[${service}] [${level}] ${timestamp} [${context}] ${message} ${
            data ? `- ${JSON.stringify(data)}` : ''
          }`,
      ),
    ),
  });
}

const logger = createLogger({
  level: isProduction ? 'info' : 'debug',
  format: format.combine(format.splat(), format.metadata(), format.timestamp()),
  levels,
  transports,
  defaultMeta,
});

export { logger, transports, defaultMeta };
