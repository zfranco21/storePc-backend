const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { validateFields } = require("../middlewares/validateFields");

// Rutas para el CRUD de categorías
router.get("/", categoryController.getAllCategories); // Obtener todas las categorías

router.get(
  "/:id",
  [check("id", "El ID debe ser un MongoID válido").isMongoId(), validateFields],
  categoryController.getCategoryById
);

router.post(
  "/",
  [
    check("name", "El nombre es obligatorio").notEmpty(),
    check("description", "La descripción es obligatoria").notEmpty(),
    validateFields,
  ],
  categoryController.createCategory
);

router.put(
  "/:id",
  [
    check("id", "El ID debe ser un MongoID válido").isMongoId(),
    check("name", "El nombre es obligatorio").optional().notEmpty(),
    check("description", "La descripción es obligatoria").optional().notEmpty(),
    validateFields,
  ],
  categoryController.updateCategory
);

router.delete(
  "/:id",
  [check("id", "El ID debe ser un MongoID válido").isMongoId(), validateFields],
  categoryController.deleteCategory
);

module.exports = router;
