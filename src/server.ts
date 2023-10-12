import { Server } from 'http'
import mongoose from 'mongoose'
import app from './app'
import config from './config'
import { errorLogger, logger } from './shared/logger'

let server: Server
let isShuttingDown = false

process.on('unhandledRejection', (reason, promise) => {
  errorLogger.error('Unhandled Promise Rejection:', reason)
  // Optionally, you can also log the stack trace for debugging purposes.
  errorLogger.error('Promise Stack Trace:', promise)

  if (!isShuttingDown) {
    // If the server is not already shutting down, initiate a graceful shutdown.
    isShuttingDown = true
    server.close(() => {
      logger.info('Server closed gracefully')
      process.exit(1)
    })
  }
})

async function bootstrap() {
  try {
    await mongoose.connect(config.databaseUrl as string)
    logger.info('Database connected')
    server = app.listen(config.port, () => {
      logger.info(`App listening on port ${config.port}`)
    })

    process.on('SIGTERM', () => {
      logger.info('SIGTERM IS RECEIVED')
      if (!isShuttingDown) {
        isShuttingDown = true
        server.close(() => {
          logger.info('Server closed gracefully')
          process.exit(0)
        })
      }
    })
  } catch (error) {
    errorLogger.error('Error during bootstrap:', error)
  }
}

bootstrap()
