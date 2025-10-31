import cors from 'cors';
import express from 'express';
import { pino } from 'pino';
import { authRoutes } from './routes/auth';
import { fileRoutes } from 'routes/file';
import { handleError } from 'middlewares/handle-errors.middleware';
import { swaggerSpec } from './config/swagger';
import swaggerUi from 'swagger-ui-express';
import cookierParser from 'cookie-parser';

const logger = pino({ name: 'server start' });
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookierParser())

app.get('/', (req, res) => res.send('Welcome to the API'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(authRoutes);
app.use("/file", fileRoutes);

app.use((req, res) => res.status(404).json({ message: 'Not Found' }));
app.use(handleError);

export { app, logger };
