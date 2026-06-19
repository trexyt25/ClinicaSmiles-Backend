const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

// Registrar un nuevo paciente (Alta)
router.post('/', async (req, res) => {
    try {
        const nuevoPaciente = new Patient(req.body);
        await nuevoPaciente.save();
        res.status(201).json(nuevoPaciente);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Obtener todos los pacientes
router.get('/', async (req, res) => {
    try {
        const pacientes = await Patient.find();
        res.json(pacientes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar un paciente (Modificación)
router.put('/:id', async (req, res) => {
    try {
        const pacienteActualizado = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(pacienteActualizado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Eliminar un paciente (Baja)
router.delete('/:id', async (req, res) => {
    try {
        await Patient.findByIdAndDelete(req.params.id);
        res.json({ message: 'Paciente eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;