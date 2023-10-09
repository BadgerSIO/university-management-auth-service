import mongoose from "mongoose";
import config from "./config";
import app from "./app";

async function bootstrap() {
  try {
    await mongoose.connect(config.databaseUrl as string);
    console.log("Database connected");
    app.listen(config.port, () => {
      console.log(`App listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
bootstrap();
