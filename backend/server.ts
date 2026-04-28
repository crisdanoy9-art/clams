import express, { Request, Response } from 'express';
import api from './routes/api'; // Ensure this path is correct

const app = express();
const PORT = 3001;

app.use(express.json());

// Mount the router
app.use(api); 

app.get('/', (req: Request, res: Response) => {
  res.send('Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});