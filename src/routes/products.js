import express from 'express';
import { listProducts, handleInquiry, showInquirySuccess } from '../controllers/productsController.js';
const router = express.Router();
router.get('/', listProducts);
router.post('/inquire', handleInquiry);
router.get('/inquire/success', showInquirySuccess);
router.get('/json', async (req, res, next) => {
  try {
    const products = await ProductModel.getAll();
    // reuse same filtering logic as controller or call a shared helper
    // For brevity, do simple filtering here similar to listProducts
    const { categories, availability } = req.query;
    const selectedCats = Array.isArray(categories) ? categories : (typeof categories === 'string' && categories.length ? categories.split(',') : []);
    const availFilter = typeof availability === 'string' ? availability : '';
    const filtered = (products || []).filter(p => {
      if (selectedCats.length && !selectedCats.includes(p.category)) return false;
      if (availFilter === 'in' && !p.available) return false;
      if (availFilter === 'out' && p.available) return false;
      return true;
    });
    res.json(filtered);
  } catch (err) {
    next(err);
  }
});

export default router;
