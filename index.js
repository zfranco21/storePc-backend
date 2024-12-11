const express = require("express");
const mongoose = require("mongoose");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Conexión a MongoDB
mongoose
  .connect("mongodb://localhost:27017/storepc", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error al conectar con MongoDB", err));

// Rutas
app.use("/api/products", productRoutes); // Prefijo para las rutas de productos
app.use("/api/users", userRoutes); // Prefijo para las rutas de usuarios
app.use("/api/categories", categoryRoutes); // Prefijo para las rutas de categorías
app.use("/api/orders", orderRoutes); // Prefijo para las rutas de órdenes

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
