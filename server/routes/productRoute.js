const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProduct } = require("../controller/productController");
const { isAuthenticated, authorizedRoles } = require("../middleware/authentication");

const router = express.Router();

router.route("/all-products").get(getAllProducts);
router.route("/specific-product/:id").get(getProduct);
router.route("/create").post(createProduct);
router.route("/update/:id").put(isAuthenticated, authorizedRoles("admin"), updateProduct);
router.route("/delete/:id").delete(isAuthenticated, authorizedRoles("admin"), deleteProduct);

module.exports = router;