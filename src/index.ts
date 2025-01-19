import express from "express";
import dotenv from "dotenv";
import router from "./routes/api";
import bodyParser from "body-parser";
import db from "./untils/database"

async function init() {
    try {
        dotenv.config();
        const PORT = process.env.PORT;
        const app = express();
        app.use(bodyParser.json());

        // connect to database
        const dbStatus = await db();
        console.log(dbStatus);

        app.get('/', (req, res) => {
            res.status(200).json({ message: 'Server is running' , data: null});
        });

        // middleware
        app.use('/api', router);

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        const err = error as unknown as Error
        console.error(err.message);

    }
};

init();