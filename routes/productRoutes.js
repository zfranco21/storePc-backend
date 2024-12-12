const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// CRUD
router.get("/", productController.getAllProducts); // Obtener todos los productos
router.post("/", productController.createProduct); // Crear un producto
router.put("/:id", productController.updateProduct); // Actualizar un producto
router.delete("/:id", productController.deleteProduct); // Eliminar un producto

// Filtros y búsquedas
router.get("/filter", productController.filterByStock); // Filtrar por disponibilidad de stock
router.get("/:id", productController.getProductById); // Obtener un producto por ID
router.get("/:categoryId/products", productController.getProductsByCategory); // Filtrar por categoría
router.get("/search", productController.searchProducts); // Buscar productos por palabras clave
// Actualizar stock
router.put("/:productId/stock", productController.updateStock);
// Habilitar/deshabilitar producto
router.put("/:productId/state", productController.toggleProductState);
// obtener productos aleatorios
router.get("/random", productController.getRandomProducts);

module.exports = router;
