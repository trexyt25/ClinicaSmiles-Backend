const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient'); // Asegúrate de que la ruta a tu modelo sea correcta
const Dentist = require('../models/Dentist'); // Asegúrate de que la ruta a tu modelo sea correcta

// ==========================================
//                CRUD BÁSICO
// ==========================================

// 1. Agendar una nueva cita
router.post('/', async (req, res) => {
    try {
        const nuevaCita = new Appointment(req.body);
        await nuevaCita.save();
        res.status(201).json(nuevaCita);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 2. Obtener todas las citas (Forzando la resolución de modelos en populate)
router.get('/', async (req, res) => {
    try {
        const citas = await Appointment.find()
            .populate({ path: 'paciente', model: Patient })
            .populate({ path: 'dentista', model: Dentist });
        res.json(citas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Modificar/Actualizar una cita
router.put('/:id', async (req, res) => {
    try {
        const citaActualizada = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate({ path: 'paciente', model: Patient })
            .populate({ path: 'dentista', model: Dentist });
        res.json(citaActualizada);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 4. Cancelar/Eliminar una cita
router.delete('/:id', async (req, res) => {
    try {
        await Appointment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Cita eliminada de la base de datos' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;