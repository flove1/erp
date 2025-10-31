import cors from 'cors';
import express from 'express';
import { pino } from 'pino';
import authRoutes from './routes/auth/auth.routes';
import { fileRoutes } from 'routes/file';
import { handleError } from 'middlewares/handle-errors.middleware';

const logger = pino({ name: 'server start' });
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('Welcome to the API'));
app.use(authRoutes);
app.use("/file", fileRoutes);

app.use((req, res) => res.status(404).json({ message: 'Not Found' }));
app.use(handleError);

export { app, logger };
