import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import requestRouter from "./routers/request";

const app = express();
export const port = 8000;

app.use(express.json());
app.use(cors());

    app.use('/requests', requestRouter);


const run = async () => {
    await mongoose.connect(`mongodb://localhost:27017/customers`);

    app.listen(port, () => {
        console.log(`Server running on ${port} port`);
    });

    process.on("exit", (err) => {
        mongoose.disconnect();
    });
};

run().catch(console.error);
