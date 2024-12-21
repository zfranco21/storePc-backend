const express = require("express");
const { check, param, query } = require("express-validator");
const router = express.Router();
const productController = require("../controllers/productController");

// CRUD
router.get("/", productController.getAllProducts);
router.post(
  "/",
  [
    check("name").notEmpty().withMessage("El nombre es obligatorio."),
    check("price")
      .isFloat({ min: 0 })
      .withMessage("El precio debe ser un número positivo."),
    check("category").notEmpty().withMessage("La categoría es obligatoria."),
  ],
  productController.createProduct
);
router.put(
  "/:id",
  [
    param("id").isMongoId().withMessage("ID inválido."),
    check("name")
      .optional()
      .notEmpty()
      .withMessage("El nombre no puede estar vacío."),
    check("price")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("El precio debe ser un número positivo."),
  ],
  productController.updateProduct
);
router.delete(
  "/:id",
  [param("id").isMongoId().withMessage("ID inválido.")],
  productController.deleteProduct
);

// Filtros y búsquedas
router.get("/:categoryId/products", productController.getProductsByCategory); // Filtrar por categoría
router.get("/filter", productController.filterByStock); // Filtrar por disponibilidad de stock
router.get("/search", productController.searchProducts); // Buscar productos por palabras clave
router.get("/random", productController.getRandomProducts); // Obtener productos aleatorios
router.get("/:id", productController.getProductById); // Obtener un producto por ID
router.get(
  "/filter",
  [
    query("inStock")
      .optional()
      .isBoolean()
      .withMessage("El parámetro inStock debe ser true o false."),
  ],
  productController.filterByStock
);
router.get(
  "/:id",
  [param("id").isMongoId().withMessage("ID inválido.")],
  productController.getProductById
);
router.get(
  "/:categoryId/products",
  [param("categoryId").isMongoId().withMessage("ID de categoría inválido.")],
  productController.getProductsByCategory
);
router.get(
  "/search",
  [
    query("query")
      .notEmpty()
      .withMessage("El parámetro de búsqueda es obligatorio."),
  ],
  productController.searchProducts
);

// Actualizar stock
router.put(
  "/:productId/stock",
  [
    param("productId").isMongoId().withMessage("ID inválido."),
    check("stock")
      .isInt({ min: 0 })
      .withMessage("El stock debe ser un número entero no negativo."),
  ],
  productController.updateStock
);

// Habilitar/deshabilitar producto
router.put(
  "/:productId/state",
  [
    param("productId").isMongoId().withMessage("ID inválido."),
    check("isEnabled")
      .isBoolean()
      .withMessage("El estado debe ser true o false."),
  ],
  productController.toggleProductState
);

// Obtener productos aleatorios
router.get("/random", productController.getRandomProducts);

module.exports = router;
