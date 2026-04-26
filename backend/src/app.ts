import express, { Request, Response } from 'express';

const app = express();
const PORT = 3001; // Change 3000 to 3001
// Middleware to parse JSON bodies
app.use(express.json());

// A simple route to test if the server is running
app.get('/', (req: Request, res: Response) => {
  res.send('Backend is running and ready for the frontend!');
});

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
}).on('error', (err: any) => {
  console.error('FATAL ERROR: The server failed to start!');
  console.error(err);
});