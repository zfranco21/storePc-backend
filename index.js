const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Conexión a MongoDB
mongoose
  .connect("mongodb://localhost:27017/storepc")
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => {
    console.error("Error al conectar con MongoDB", err);
    process.exit(1); // Salir de la aplicación si no se puede conectar
  });

// Rutas
app.use("/api/auth", authRoutes); // ruta de autenticación
app.use("/api/users", userRoutes); // Prefijo para las rutas de usuarios
app.use("/api/products", productRoutes); // Prefijo para las rutas de productos
app.use("/api/categories", categoryRoutes); // Prefijo para las rutas de categorías
app.use("/api/orders", orderRoutes); // Prefijo para las rutas de órdenes

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
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
