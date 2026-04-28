import { Router, Request, Response } from 'express';

const router = Router();

// GET all items
router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Get all items' });
});

// GET single item
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({ message: `Get item ${id}` });
});

// POST create item
router.post('/', (req: Request, res: Response) => {
  const data = req.body;
  res.status(201).json({ message: 'Item created', data });
});

// PUT update item
router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  res.json({ message: `Item ${id} updated`, data });
});

// DELETE item
router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({ message: `Item ${id} deleted` });
});

export default router;