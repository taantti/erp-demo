import express from 'express';
import aux from "../../utils/auxiliary.js";
import { login } from './services/index.js';

const router = express.Router();

router.post('/', login);

export default router;
