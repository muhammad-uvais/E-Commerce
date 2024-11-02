module.exports = (er, req, res, next) => {
    er.statusCode = er.statusCode || 500;
    er.message = er.message || "Server Error";
    res.status(er.statusCode).json({
        success: false,
        message: er.message,
    });
};