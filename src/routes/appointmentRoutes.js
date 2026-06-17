const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// ==========================================
//               CRUD BÁSICO
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

// 2. Obtener todas las citas (con datos completos de paciente y dentista)
router.get('/', async (req, res) => {
    try {
        const citas = await Appointment.find()
            .populate('paciente')
            .populate('dentista');
        res.json(citas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Modificar/Actualizar una cita (o cambiar su estado)
router.put('/:id', async (req, res) => {
    try {
        const citaActualizada = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('paciente')
            .populate('dentista');
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
        res.status(500).json({ error: error.message });
    }
});


// ==========================================
//        LAS 5 CONSULTAS AVANZADAS
// ==========================================

// Consulta 1: Citas agendadas para un día específico (Filtro por Fecha)
router.get('/buscar/por-fecha', async (req, res) => {
    try {
        const { fecha } = req.query; // Ejemplo: /api/appointments/buscar/por-fecha?fecha=2026-06-17
        const citas = await Appointment.find({ fecha }).populate('paciente').populate('dentista');
        res.json(citas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Consulta 2: Pacientes que registraron cita recientemente (Últimas 5 citas ordenadas)
router.get('/buscar/recientes', async (req, res) => {
    try {
        const citasRecientes = await Appointment.find()
            .sort({ $natural: -1 }) // Obtiene las últimas creadas en MongoDB
            .limit(5)
            .populate('paciente')
            .populate('dentista');
        res.json(citasRecientes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Consulta 3: Historial de citas con estado "Cancelada"
router.get('/buscar/canceladas', async (req, res) => {
    try {
        const canceladas = await Appointment.find({ estadoCita: 'Cancelada' })
            .populate('paciente')
            .populate('dentista');
        res.json(canceladas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Consulta 4: Citas asignadas a un dentista en específico
router.get('/buscar/por-dentista/:dentistaId', async (req, res) => {
    try {
        const citas = await Appointment.find({ dentista: req.params.dentistaId })
            .populate('paciente')
            .populate('dentista');
        res.json(citas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Consulta 5: Filtrar citas por la especialidad del dentista
router.get('/buscar/por-especialidad', async (req, res) => {
    try {
        const { especialidad } = req.query; // Ejemplo: ?especialidad=Ortodoncia
        
        // Buscamos primero las citas y traemos los datos del dentista encajado
        const todasLasCitas = await Appointment.find().populate('paciente').populate('dentista');
        
        // Filtramos las que coincidan con la especialidad requerida
        const filtradas = todasLasCitas.filter(cita => 
            cita.dentista && cita.dentista.especialidad.toLowerCase() === especialidad.toLowerCase()
        );
        
        res.json(filtradas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;