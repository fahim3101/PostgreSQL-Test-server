import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './routes';
import notFound from './middlewares/notFound';
import globalErrorHandler from './middlewares/globalErrorHandler';

const app: Application = express();

app.use(
  cors({
    origin: ['https://postgre-sql-test-client.vercel.app', 'http://localhost:5173'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'SCIC/EJP-13 Backend API is running' });
});

app.use('/api', router);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
