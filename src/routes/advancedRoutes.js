const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Dentist = require('../models/Dentist');

// 1. Mostrar citas de un día específico
router.get('/citas-dia', async (req, res) => {
    try {
        const { fecha } = req.query; // Formato esperado: YYYY-MM-DD
        const citas = await Appointment.find({ fecha: fecha }).populate('paciente').populate('dentista');
        res.json(citas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Mostrar pacientes registrados recientemente (Últimos 5 ordenados por fecha)
router.get('/pacientes-recientes', async (req, res) => {
    try {
        const pacientes = await Patient.find().sort({ createdAt: -1 }).limit(5);
        res.json(pacientes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Mostrar citas canceladas
router.get('/citas-canceladas', async (req, res) => {
    try {
        const citas = await Appointment.find({ estado: 'Cancelar' }).populate('paciente').populate('dentista'); // O 'Cancelada' según tu select
        res.json(citas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Mostrar cantidad de citas por dentista (Usa agregaciones de MongoDB)
router.get('/citas-por-dentista', async (req, res) => {
    try {
        const resultado = await Appointment.aggregate([
            {
                $group: {
                    _id: "$dentista",
                    totalCitas: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "dentists", // Nombre exacto de tu colección de dentistas en MongoDB Atlas
                    localField: "_id",
                    foreignField: "_id",
                    as: "infoDentista"
                }
            },
            { $unwind: "$infoDentista" }
        ]);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. Mostrar citas por especialidad
router.get('/citas-por-especialidad', async (req, res) => {
    try {
        const { especialidad } = req.query;
        const resultado = await Appointment.aggregate([
            {
                $lookup: {
                    from: "dentists",
                    localField: "dentista",
                    foreignField: "_id",
                    as: "infoDentista"
                }
            },
            { $unwind: "$infoDentista" },
            {
                $match: { "infoDentista.especialidad": { $regex: especialidad, $options: "i" } }
            },
            {
                $lookup: {
                    from: "patients",
                    localField: "paciente",
                    foreignField: "_id",
                    as: "infoPaciente"
                }
            },
            { $unwind: "$infoPaciente" }
        ]);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;