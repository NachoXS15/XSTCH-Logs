import express from 'express';
import cors from 'cors'
import logRouter from './routes/routes.js'
import db from './database/db.js';
const app = express();

app.use(express.json());
app.use('/logs', logRouter)
app.use(cors());

try {
    await db.authenticate()
    console.log("todo bien")
} catch (error) {
    console.log("todo mal :c")
}

app.get('/', (req, res) => {
    res.send("GOD")
})
app.listen(3000, () =>{
    console.log("server on port");
})