const { validationResult } = require("express-validator");
const Product = require("../models/Product");

// Función para manejar errores de validación
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
};

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
  if (handleValidationErrors(req, res)) return;

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el producto" });
  }
};

// Crear un producto nuevo
exports.createProduct = async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ error: "Error al crear el producto" });
  }
};

// Actualizar un producto
exports.updateProduct = async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
};

// Eliminar un producto
exports.deleteProduct = async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.status(200).json({ message: "Producto eliminado con éxito" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
};

// Filtrar productos por disponibilidad de stock
exports.filterByStock = async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const { inStock } = req.query;
    const filter =
      inStock === "true"
        ? { stock: { $gt: 0 } }
        : inStock === "false"
        ? { stock: 0 }
        : {};
    const products = await Product.find(filter).populate("category");
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: "Error al filtrar productos por stock" });
  }
};

// Obtener productos por categoría
exports.getProductsByCategory = async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const { categoryId } = req.params;
    const products = await Product.find({ category: categoryId }).populate(
      "category"
    );
    if (!products.length) {
      return res
        .status(404)
        .json({ error: "No se encontraron productos en esta categoría" });
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener productos por categoría" });
  }
};

// Buscar productos por palabras clave
exports.searchProducts = async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const { query } = req.query;
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    }).populate("category");
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: "Error al buscar productos" });
  }
};

// Actualizar stock de un producto
exports.updateStock = async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const { productId } = req.params;
    const { stock } = req.body;

    const product = await Product.findByIdAndUpdate(
      productId,
      { stock },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.status(200).json({ message: "Stock actualizado con éxito", product });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar el stock" });
  }
};

// Habilitar/deshabilitar un producto
exports.toggleProductState = async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const { productId } = req.params;
    const { isEnabled } = req.body;

    const product = await Product.findByIdAndUpdate(
      productId,
      { isEnabled },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const message = isEnabled
      ? "Producto habilitado con éxito"
      : "Producto deshabilitado con éxito";
    res.status(200).json({ message, product });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error al actualizar el estado del producto" });
  }
};

// Obtener productos aleatorios
exports.getRandomProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([{ $sample: { size: 10 } }]);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener productos aleatorios" });
  }
};
