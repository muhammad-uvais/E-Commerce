const tryCatchError = require("./tryCatchError")
const CatchError = require("../resources/catchError")
const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

exports.isAuthenticated = tryCatchError(async (req, res, next) => {
    const { token } = req.cookies
    if (!token) {
        return next(new CatchError("Please login to access this resourse", 401))
    }
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(verifyToken.id)
    next()
})

exports.authorizedRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new CatchError(`Role:${req.user.role} not allowd to access`))
        }
        next()
    }
}