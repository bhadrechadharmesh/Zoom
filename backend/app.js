import express from "express"
import {createServer} from "node:http"
import dotenv from "dotenv";

import mongoose from "mongoose"
import { connectToSocket } from "./controllers/socketManager.js"
import cors from "cors"

import userRoute from "./routes/users_routes.js";

dotenv.config();

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port",(process.env.PORT || 8000))

app.use(cors());
app.use(express.json({limit:"40kb"}))
app.use(express.urlencoded({limit:"40kb" , extended:true}))

app.use("/api/v1/users",userRoute);

const start = async ()=>{
    const connectionDb = await mongoose.connect(process.env.MONGO_URI)

    console.log(`mongo connected Host: ${connectionDb.connection.host}`);
    server.listen(app.get("port"),()=>{
        console.log("server started");
    })
}

start()


