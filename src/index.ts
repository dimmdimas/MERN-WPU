import express from "express";
import dotenv from "dotenv";
import router from "./routes/api";
import bodyParser from "body-parser";
import db from "./untils/database"

dotenv.config();
const PORT = process.env.PORT;
const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is running' , data: null});
});

app.use('/api', router);

async function init() {
    try {
        // connect to database
        const dbStatus = await db();
        console.log(dbStatus);

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        const err = error as unknown as Error
        console.error(err.message);

    }
};

init();

export default app;    