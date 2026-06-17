const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    paciente: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    dentista: { type: mongoose.Schema.Types.ObjectId, ref: 'Dentist', required: true },
    fecha: { type: String, required: true }, // Formato YYYY-MM-DD
    hora: { type: String, required: true },  // Formato HH:MM
    motivoConsulta: { type: String, required: true },
    estadoCita: { 
        type: String, 
        enum: ['Programada', 'Confirmada', 'Atendida', 'Cancelada'], 
        default: 'Programada' 
    }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);