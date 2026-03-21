import * as ProductModel from '../models/productModel.js';
import * as InquiryModel from '../models/inquiryModel.js';

/**
 * Parse query params into a normalized filters object
 */
function parseFilters(query) {
  const { categories, availability } = query || {};
  const selectedCats = Array.isArray(categories)
    ? categories
    : (typeof categories === 'string' && categories.length ? categories.split(',') : []);
  const availFilter = typeof availability === 'string' ? availability : '';
  return { categories: selectedCats, availability: availFilter };
}

/**
 * GET /products
 * Renders products page with optional filters applied via query string.
 * Query params:
 *  - categories (comma separated or repeated) e.g. ?categories=seat-covers,floor-mats
 *  - availability = 'in' | 'out' | '' (empty = any)
 */
export async function listProducts(req, res, next) {
  try {
    const all = await ProductModel.getAll();
    const filters = parseFilters(req.query);

    const filtered = (all || []).filter(p => {
      // category filter
      if (filters.categories.length && !filters.categories.includes(p.category)) return false;
      // availability filter
      if (filters.availability === 'in' && !p.available) return false;
      if (filters.availability === 'out' && p.available) return false;
      return true;
    });

    console.log('[listProducts] products count:', Array.isArray(filtered) ? filtered.length : 0, 'filters:', filters);
    res.render('products', { products: filtered, title: 'Products', filters });
  } catch (err) {
    console.error('[listProducts] error', err);
    res.render('products', { products: [], title: 'Products', filters: { categories: [], availability: '' } });
  }
}

/**
 * Optional JSON endpoint for AJAX filtering
 * GET /products/json
 * Returns filtered products as JSON using same query params as listProducts.
 */
export async function listProductsJson(req, res, next) {
  try {
    const all = await ProductModel.getAll();
    const filters = parseFilters(req.query);

    const filtered = (all || []).filter(p => {
      if (filters.categories.length && !filters.categories.includes(p.category)) return false;
      if (filters.availability === 'in' && !p.available) return false;
      if (filters.availability === 'out' && p.available) return false;
      return true;
    });

    res.json(filtered);
  } catch (err) {
    next(err);
  }
}

export async function handleInquiry(req, res, next) {
  try {
    const { productId, name, email, message } = req.body;
    const errors = [];
    if (!name || !name.trim()) errors.push('Name is required.');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('A valid email is required.');
    if (!message || !message.trim()) errors.push('Message is required.');

    if (errors.length) {
      const products = await ProductModel.getAll();
      // keep filters empty here so the page renders predictably after validation errors
      return res.status(400).render('products', {
        products,
        title: 'Products',
        formErrors: errors,
        formData: req.body,
        filters: { categories: [], availability: '' }
      });
    }

    await InquiryModel.create({
      productId: productId ? Number(productId) : null,
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString()
    });

    return res.redirect('/products/inquire/success');
  } catch (err) {
    next(err);
  }
}

export function showInquirySuccess(req, res) {
  res.render('products_inquiry_success', { title: 'Inquiry Sent' });
}
