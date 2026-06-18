const express = require('express');
const cors = require('cors');
const connectDB = require('./database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Conectar a la Base de Datos
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Registro de las Rutas de la API
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/dentists', require('./routes/dentistRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use("/api/advanced", require("./routes/advancedRoutes"));

// Ruta de prueba inicial
app.get('/', (req, res) => {
    res.send('Servidor de la Clínica Dental Smiles operando correctamente.');
});

// Levantar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});