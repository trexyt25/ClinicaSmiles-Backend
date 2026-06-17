const express = require('express');
const router = express.Router();
const Dentist = require('../models/Dentist');

// 1. Registrar un nuevo dentista
router.post('/', async (req, res) => {
    try {
        const nuevoDentista = new Dentist(req.body);
        await nuevoDentista.save();
        res.status(201).json(nuevoDentista);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 2. Obtener todos los dentistas
router.get('/', async (req, res) => {
    try {
        const dentistas = await Dentist.find();
        res.json(dentistas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Actualizar datos de un dentista
router.put('/:id', async (req, res) => {
    try {
        const dentistaActualizado = await Dentist.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(dentistaActualizado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 4. Eliminar un dentista
router.delete('/:id', async (req, res) => {
    try {
        await Dentist.findByIdAndDelete(req.params.id);
        res.json({ message: 'Dentista eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;