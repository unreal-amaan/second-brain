import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"



const app = express();
dotenv.config();

async function main() {
    try {
        const mongourl:string = process.env.MONGO_URL as string
        await mongoose.connect(mongourl)
        app.listen(3000 , () => {
            console.log("Server running at port 3000");
        })
    }catch (error) {
        console.log("Error in connecting to server");
    }
}

main();