const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const orderRoutes = require("./routes/orderRoutes");
require("dotenv").config(); // Cargar variables de entorno desde un archivo .env
const cors = require("cors");

const app = express();
const PORT = process.env.PORT; // Usar el puerto desde variables de entorno o 3000 por defecto

// Middleware
app.use(express.json(), cors());

// Conexión a MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado a MongoDB Atlas"))
  .catch((err) => {
    console.error("Error al conectar con MongoDB Atlas", err);
  });

// Rutas
app.use("/auth", authRoutes); // Ruta de autenticación
app.use("/users", userRoutes); // Prefijo para las rutas de usuarios
app.use("/products", productRoutes); // Prefijo para las rutas de productos
app.use("/categories", categoryRoutes); // Prefijo para las rutas de categorías
app.use("/orders", orderRoutes); // Prefijo para las rutas de órdenes

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Error interno del servidor" });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en ${PORT}`);
});
