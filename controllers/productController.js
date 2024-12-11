const Product = require("../models/Product");

// Obtener todos los productos
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los productos" });
  }
};

// Obtener un producto por ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ error: "Producto no encontrado" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el producto" });
  }
};

// Crear un producto nuevo
exports.createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ error: "Error al crear el producto" });
  }
};

// Actualizar un producto
exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Devuelve el documento actualizado
    );
    if (!updatedProduct)
      return res.status(404).json({ error: "Producto no encontrado" });
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: "Error al actualizar el producto" });
  }
};

// Eliminar un producto
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ error: "Producto no encontrado" });
    res.status(200).json({ message: "Producto eliminado con éxito" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
};
