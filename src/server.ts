import mongoose from 'mongoose'
import app from './app'
import config from './config'

async function bootstrap() {
  try {
    await mongoose.connect(config.databaseUrl as string)
    // eslint-disable-next-line no-console
    console.log('Database connected')
    app.listen(config.port, () => {
      // eslint-disable-next-line no-console
      console.log(`App listening on port ${config.port}`)
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
  }
}
bootstrap()
