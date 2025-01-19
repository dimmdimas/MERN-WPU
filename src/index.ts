import express  from "express";
import dotenv from "dotenv";
import router from "./routes/api";

dotenv.config();

const PORT = 3000;
const app = express();

// middleware
app.use('/api', router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});