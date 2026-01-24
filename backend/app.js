import express from "express"
import {createServer} from "node:http"

import {Server} from "socket.io"

import mongoose, { mongo } from "mongoose"
import { connectToSocket } from "./controllers/socketManager.js"
import cors from "cors"

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port",(process.env.PORT || 8000))

app.set("mongoUrl",(process.env.MONGO_URL || "your_url"));

app.use(cors());
app.use(express.json({limit:"40kb"}))
app.use(express.urlencoded({limit:"40kb" , extended:true}))


const start = async ()=>{
    // const connectionDb = await mongoose.connect("mongoUrl")

    // console.log(`mongo connected Host: ${connectionDb.connection.host}`);
    server.listen(app.get("port"),()=>{
        console.log("server started");
    })
}

start()


