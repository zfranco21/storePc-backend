const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// Rutas para el CRUD de categorías
router.get("/", categoryController.getAllCategories); // Obtener todas las categorías
router.get("/:id", categoryController.getCategoryById); // Obtener una categoría por ID
router.post("/", categoryController.createCategory); // Crear una categoría
router.put("/:id", categoryController.updateCategory); // Actualizar una categoría
router.delete("/:id", categoryController.deleteCategory); // Eliminar una categoría

module.exports = router;
