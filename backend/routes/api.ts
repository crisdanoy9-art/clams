import { Router } from 'express';
import {Get, Post, Update, Delete} from '../controller/logic';

const router = Router();

// This makes the endpoint: POST http://localhost:3001/test/api
router.get('/test/api', Get); 
router.post('/test/api', Post);
router.put('/test/api/:id', Update);
router.delete('/test/api/:id', Delete);


export default router; // IMPORTANT: You must export default