import express from 'express';
import { renderHome, renderAbout, renderProducts } from '../controllers/pagesController.js';

const router = express.Router();

router.get('/', renderHome);
router.get('/about', renderAbout);
router.get('/products', renderProducts);

export default router;
