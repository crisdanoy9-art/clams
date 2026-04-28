import { Router } from 'express';
import { Post } from '../controller/logic'; // Import your logic here

const router = Router();

// This makes the endpoint: POST http://localhost:3001/test/api
router.post('/test/api', Post); 

export default router; // IMPORTANT: You must export default