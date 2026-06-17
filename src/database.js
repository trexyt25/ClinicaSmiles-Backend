const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('¡Conexión exitosa a MongoDB Atlas!');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error.message);
        process.exit(1); // Detiene la app si no se puede conectar
    }
};

module.exports = connectDB;