import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import UserRoutes from "./src/routes/user.routes"

const app = express();
dotenv.config();

app.use(express.json());
app.use("/user" , UserRoutes);


async function main() {
    try {
        const mongourl = process.env.MONGO_URL as string
        await mongoose.connect(mongourl)
        app.listen(3000 , () => {
            console.log("Server running at port 3000");
        })
    }catch (error) {
        console.log("Error in connecting to server");
    }
}

main();