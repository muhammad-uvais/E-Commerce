const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();
    const cokkieGenerate = {
      expire: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 10000
      ),
    };
    res.status(statusCode).cookie("token", token, cokkieGenerate).json({
      success: true,
      user,
      token,
    });
  };
  module.exports = sendToken;