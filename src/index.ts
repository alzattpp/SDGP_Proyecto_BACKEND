import dotenv from "dotenv";
import Server from "./server";  

dotenv.config();

const server = new Server();
server.listen();
console.log("Server is running on port", process.env.PORT);