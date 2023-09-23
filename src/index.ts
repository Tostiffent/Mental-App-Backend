import { connectDatabase } from "./db/mongo";
import { startServer } from "./server";

connectDatabase();
startServer();
