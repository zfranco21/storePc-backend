const express = require("express");
const { body, param } = require("express-validator");
const { validateFields } = require("../middlewares/validateFields");
const router = express.Router();
const userController = require("../controllers/userController");

// Rutas para el CRUD de usuarios
router.get("/", userController.getAllUsers); // Obtener todos los usuarios

router.get(
  "/:id",
  [param("id").isMongoId().withMessage("ID inválido"), validateFields], // Validar ID
  userController.getUserById
);

router.post(
  "/searchByEmail",
  [
    body("email").isEmail().withMessage("Debe proporcionar un email válido"),
    validateFields,
  ], // Validar email
  userController.getUserByEmail
);

router.post(
  "/",
  [
    body("name").notEmpty().withMessage("El nombre es obligatorio"),
    body("email").isEmail().withMessage("Debe ser un email válido"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("La contraseña debe tener al menos 6 caracteres"),
    validateFields,
  ],
  userController.createUser
);

router.put(
  "/:id/enable",
  [param("id").isMongoId().withMessage("ID inválido"), validateFields],
  userController.enableUser
);

router.put(
  "/:id",
  [
    param("id").isMongoId().withMessage("ID inválido"),
    body("name")
      .optional()
      .notEmpty()
      .withMessage("El nombre no puede estar vacío"),
    body("email").optional().isEmail().withMessage("Debe ser un email válido"),
    validateFields,
  ],
  userController.updateUser
);

router.delete(
  "/:id",
  [param("id").isMongoId().withMessage("ID inválido"), validateFields],
  userController.deleteUser
);

module.exports = router;
