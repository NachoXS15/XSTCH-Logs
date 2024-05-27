import express from 'express';
import cors from 'cors'
import logRouter from './routes/logsRoutes.js'
import clientsRouter from './routes/clientsRoutes.js'
import servicesRouter from './routes/servicesRoutes.js'
const app = express();
app.use(cors());

app.use(express.json());
app.use('/logs', logRouter)
app.use('/clients', clientsRouter)
app.use('/services', servicesRouter)
app.use('/', (req, res) => {
    res.status(200).json({
        status: 'ok'
    });
})

app.listen(3000, () => {
    console.log("server on port 3000");
})