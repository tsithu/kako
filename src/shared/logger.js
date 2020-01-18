import pino from 'pino'
import { name } from ':/package.json'

export default ({ isProduction }) => {
  if (global.$logger) return global.$logger
  const options = {
    name,
    level: 'trace',
    prettyPrint: { colorize: true, levelFirst: false },
    timestamp: true,
    base: null
  }
  const logger = pino(isProduction ? pino.extreme() : options)
  // ************************************************************
  if (isProduction) {
    // in periods of low activity
    setInterval(() => { logger.flush() }, 10000).unref()
    // catch all the ways node might exit
    // use pino.final to create a special logger that
    // guarantees final tick writes
    const handler = pino.final(logger, (err, finalLogger, evt) => {
      finalLogger.info(`${evt} caught`)
      if (err) finalLogger.error(err, 'error caused exit')
      process.exit(err ? 1 : 0)
    })
    process.on('beforeExit', () => handler(null, 'beforeExit'))
    process.on('exit', () => handler(null, 'exit'))
    process.on('uncaughtException', err => handler(err, 'uncaughtException'))
    process.on('SIGINT', () => handler(null, 'SIGINT'))
    process.on('SIGQUIT', () => handler(null, 'SIGQUIT'))
    process.on('SIGTERM', () => handler(null, 'SIGTERM'))
  }
  // ************************************************************
  return logger
}
