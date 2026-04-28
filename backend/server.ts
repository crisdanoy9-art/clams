import express, { Application } from 'express';
import itemRoutes from './controller/logic';

const app: Application = express();

app.use(express.json());

// Routes
app.use('/api/items', itemRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});