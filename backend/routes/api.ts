import { Router } from 'express';
import {GetData} from '../controller/logic';

const router = Router();

// This makes the endpoint: POST http://localhost:3001/test/api
router.get('/test/api', GetData); 

export default router; // IMPORTANT: You must export default