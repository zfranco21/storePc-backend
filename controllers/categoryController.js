const Category = require("../models/Category");

// Obtener todas las categorías
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener las categorías" });
  }
};

// Obtener una categoría por ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ error: "Categoría no encontrada" });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener la categoría" });
  }
};

// Crear una nueva categoría
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Verificar si la categoría ya existe
    const categoryExists = await Category.findOne({ name });
    if (categoryExists)
      return res.status(400).json({ error: "La categoría ya existe" });

    // Crear la nueva categoría
    const newCategory = new Category({ name, description });
    const savedCategory = await newCategory.save();

    res.status(201).json(savedCategory);
  } catch (err) {
    res.status(400).json({ error: "Error al crear la categoría" });
  }
};

// Actualizar una categoría
exports.updateCategory = async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Devuelve el documento actualizado
    );
    if (!updatedCategory)
      return res.status(404).json({ error: "Categoría no encontrada" });
    res.status(200).json(updatedCategory);
  } catch (err) {
    res.status(400).json({ error: "Error al actualizar la categoría" });
  }
};

// Eliminar una categoría
exports.deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory)
      return res.status(404).json({ error: "Categoría no encontrada" });
    res.status(200).json({ message: "Categoría eliminada con éxito" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar la categoría" });
  }
};
