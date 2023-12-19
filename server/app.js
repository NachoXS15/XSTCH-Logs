import express from 'express';
import cors from 'cors'
import logRouter from './routes/routes.js'
import db from './database/db.js';
import axios from 'axios'
const app = express();
app.use(cors());

app.use(express.json());
app.use('/logs', logRouter)
try {
    await db.authenticate()
    console.log("todo bien")
} catch (error) {
    console.log("todo mal :c", error.message)
}


app.listen(3000, () => {
    console.log("server on port 3000");
})