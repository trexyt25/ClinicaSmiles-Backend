const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

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

// 2. Obtener todas las citas (con datos completos de paciente y dentista usando populate)
router.get('/', async (req, res) => {
    try {
        const citas = await Appointment.find().populate('paciente').populate('dentista');
        res.json(citas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Modificar/Actualizar una cita (o cambiar su estado)
router.put('/:id', async (req, res) => {
    try {
        const citaActualizada = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('paciente').populate('dentista');
        res.json(citaActualizada);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 4. Cancelar/Eliminar una cita de la base de datos
router.delete('/:id', async (req, res) => {
    try {
        await Appointment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Cita eliminada de la base de datos' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;