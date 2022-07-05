import { mongoose } from "@typegoose/typegoose";
import Logger from "../utils/logger";

export default () => {
  mongoose.connect(
    process.env.MONGO_CONNECTION_STRING,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err) => {
      if (err) {
        console.warn("Failed to connect to MongoDB.");
        console.error(err);
        process.exit(2);
      } else {
        Logger.info("DATABASE", "Connected to the database successfully.");
      }
    }
  );
}