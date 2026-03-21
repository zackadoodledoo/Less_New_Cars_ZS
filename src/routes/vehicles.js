import express from 'express';
import { listVehicles, showVehicle } from '../controllers/vehicleController.js';

const router = express.Router();

// GET /vehicles
router.get('/', listVehicles);

// GET /vehicles/:id  <-- route parameter
router.get('details/:id', showVehicle);

export default router;
