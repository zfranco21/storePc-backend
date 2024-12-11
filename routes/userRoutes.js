const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Rutas para el CRUD de usuarios
router.get("/", userController.getAllUsers); // Obtener todos los usuarios
router.get("/:id", userController.getUserById); // Obtener un usuario por ID
router.post("/searchByEmail", userController.getUserByEmail); // Buscar un usuario por email
router.post("/", userController.createUser); // Crear un usuario
router.put("/:id/enable", userController.enableUser); // habilita o deshabilita un usuario por ID
router.put("/:id", userController.updateUser); // Actualizar datos de un usuario
router.delete("/:id", userController.deleteUser); // Eliminar un usuario

module.exports = router;
