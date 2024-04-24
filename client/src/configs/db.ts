import mongoose, { ConnectOptions } from "mongoose";

const connection: any = {
  isConnected: 0,
};

/**
 * Connects to the MongoDB database.
 * @param uri The MongoDB connection string URI.
 * @param options The MongoDB connection options.
 * @returns A promise that resolves when the connection is established.
 */
export const connect_db = async ( 
  uri: string,
  options: mongoose.ConnectOptions
): Promise<void> => {
  try {
    if (connection.isConnected) {
      console.log(`MongoDB Already Connected`);
    } else {
      const conn = await mongoose.connect(uri, options);
      connection.isConnected = conn.connections[0].readyState;
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
  } catch (error: any & { msg: string }) {
    console.log(`Error: ${(error as { msg: string }).msg}`);
    process.exit();
  }
};
