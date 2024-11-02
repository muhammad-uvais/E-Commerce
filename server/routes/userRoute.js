const express = require("express");
const {
    registerUser,
    loginUser,
    logoutUser,
    forgetPassword,
    resetPassword,
    getUserDetails,
    updateProfile,
    updatePassword
} = require("../controller/userController");
const { isAuthenticated, authorizedRoles } = require('../middleware/authentication')

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);

// Protected routes with role authorization
router.get("/profile", isAuthenticated, authorizedRoles('user'), getUserDetails);
router.put("/profile/update", isAuthenticated, authorizedRoles('user'), updateProfile);
router.put("/password/update", isAuthenticated, authorizedRoles('user'), updatePassword);

module.exports = router;
 