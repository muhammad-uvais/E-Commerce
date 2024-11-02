const Product = require("../models/productModel");
const tryCatchError = require("../middleware/tryCatchError");
const CatchError = require("../resources/catchError");
    
exports.createProduct = async (req, res, next) => {
  const product = await Product.create(req.body);
  if (product) {
    res.status(201).json({
      success: true,
      product,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "Product creation failed",
    });
  }
};

exports.updateProduct = tryCatchError(async (req, res, next) => {
  const updateData = req.body;
  // Update the product by ID
  const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    return new CatchError("Product not found", 404);
  }
  res.status(200).json({
    success: true,
    message: "Product successfully updated",
    product,
  });
});

exports.deleteProduct = tryCatchError(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new CatchError("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Product successfully deleted",
    product,
  });
});

exports.getAllProducts = tryCatchError(async (req, res) => {
  const product = await Product.find();
  res.status(200).json({
    success: true,
    product,
  });
});

exports.getProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new CatchError("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
};