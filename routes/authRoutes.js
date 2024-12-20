const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const authController = require("../controllers/authController");
const { validateFields } = require("../middlewares/validateFields");

// Ruta para iniciar sesión
router.post(
  "/login",
  [
    check("email", "El email es obligatorio").notEmpty(),
    check("email", "Debe ser un email válido").isEmail(),
    check("password", "La contraseña es obligatoria").notEmpty(),
    validateFields,
  ],
  authController.login
);

module.exports = router;
