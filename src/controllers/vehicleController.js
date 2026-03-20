// src/controllers/vehicleController.js
import * as Vehicle from '../models/vehicleModel.js';

export function listVehicles(req, res, next) {
  try {
    const vehicles = Vehicle.getAll();
    res.render('vehicles/browse', { vehicles });
  } catch (err) {
    next(err);
  }
}

export function showVehicle(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).render('404'); // invalid id -> show 404 or custom message
    }

    const vehicle = Vehicle.getById(id);
    if (!vehicle) return res.status(404).render('404');

    res.render('vehicles/details', { vehicle });
  } catch (err) {
    next(err);
  }
}
