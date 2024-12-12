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
// filtra productos por categorias
exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params; // Obtiene el ID de la categoría de la URL

    const products = await Product.find({ category: categoryId }).populate(
      "category"
    ); // Filtra y puebla la categoría

    if (!products.length) {
      return res
        .status(404)
        .json({ message: "No se encontraron productos en esta categoría" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los productos" });
  }
};
// Filtra productos por disponibilidad de stock
exports.filterByStock = async (req, res) => {
  try {
    const { inStock } = req.query; // Query parameter: ?inStock=true o ?inStock=false
    let filter = {};

    if (inStock === "true") {
      filter.stock = { $gt: 0 }; // Productos con stock mayor a 0
    } else if (inStock === "false") {
      filter.stock = 0; // Productos con stock igual a 0
    }

    const products = await Product.find(filter).populate("category"); // Incluye categoría
    res.status(200).json(products);
  } catch (error) {
    console.error("Error al filtrar productos por stock:", error);
    res.status(500).json({ error: "Error al filtrar productos por stock" });
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
// Buscar productos por nombre o descripción
exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query; // Parámetro de consulta: ?query=palabraClave

    if (!query) {
      return res.status(400).json({
        error: "Debe proporcionar una palabra clave para la búsqueda.",
      });
    }

    // Buscar productos cuyo nombre o descripción coincidan con la palabra clave
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } }, // Búsqueda en el nombre (case-insensitive)
        { description: { $regex: query, $options: "i" } }, // Búsqueda en la descripción (case-insensitive)
      ],
    }).populate("category"); // Incluye información de la categoría

    res.status(200).json(products);
  } catch (error) {
    console.error("Error al buscar productos:", error);
    res.status(500).json({ error: "Error al buscar productos" });
  }
};

// Actualizar el stock de un producto
exports.updateStock = async (req, res) => {
  try {
    const { productId } = req.params; // ID del producto
    const { stock } = req.body; // Nuevo valor de stock

    // Validar que el stock no sea nulo o negativo
    if (stock == null || stock < 0) {
      return res
        .status(400)
        .json({ error: "El stock debe ser un número no negativo." });
    }

    // Actualizar el stock del producto
    const product = await Product.findByIdAndUpdate(
      productId,
      { stock },
      { new: true } // Retorna el documento actualizado
    );

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }

    res.status(200).json({ message: "Stock actualizado con éxito.", product });
  } catch (error) {
    console.error("Error al actualizar el stock:", error);
    res.status(500).json({ error: "Error al actualizar el stock." });
  }
};

// Actualizar el estado de habilitación de un producto
exports.toggleProductState = async (req, res) => {
  try {
    const { productId } = req.params; // ID del producto
    const { isEnabled } = req.body; // Estado habilitado/deshabilitado

    // Validar que el estado no sea nulo
    if (isEnabled == null) {
      return res
        .status(400)
        .json({ error: "El estado isEnabled es requerido." });
    }

    // Actualizar el estado del producto
    const product = await Product.findByIdAndUpdate(
      productId,
      { isEnabled },
      { new: true } // Retorna el documento actualizado
    );

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }

    const message = isEnabled
      ? "Producto habilitado con éxito."
      : "Producto deshabilitado con éxito.";

    res.status(200).json({ message, product });
  } catch (error) {
    console.error("Error al actualizar el estado del producto:", error);
    res
      .status(500)
      .json({ error: "Error al actualizar el estado del producto." });
  }
};

// Obtener productos aleatorios
exports.getRandomProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([{ $sample: { size: 10 } }]); // 10 productos aleatorios
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener productos aleatorios" });
  }
};
