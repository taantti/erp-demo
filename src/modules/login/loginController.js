import express from 'express';
import aux from "../../utils/auxiliary.js";
import { login } from './services/index.js';

const router = express.Router();

router.post('/', login); // JSON Web Token login (stateless). Authorization: Bearer <JWT>

export default router;
