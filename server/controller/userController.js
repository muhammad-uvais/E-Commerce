const tryCatchError = require("../middleware/tryCatchError");
const User = require("../models/userModel");
const CatchError = require("../resources/catchError");
const sendToken = require("../resources/token");
const sendEmail = require("../resources/sendEmail");
const crypto = require('crypto');

exports.registerUser = tryCatchError(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "sample id",
      url: "sample profile url",
    },
  });
  sendToken(user, 201, res);
});

exports.loginUser = tryCatchError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new CatchError("Please enter your email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new CatchError("Invalid email or password", 401));
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return next(new CatchError("Invalid email or password", 401));
  }
  sendToken(user, 200, res);
});

exports.logoutUser = tryCatchError(async (req, res, next) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.status(200).json({
    success: true,
    message: "Logout",
  });
});

exports.forgetPassword = tryCatchError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new CatchError("Email not found", 404));
  }
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${req.protocol}://${req.get("host")} /api/v1/reset-password/${resetToken}`;
  const message = `Your password reset token is: ${resetPasswordUrl} if you have not requested then ignore the message`;
  try {
    await sendEmail({
      email: user.email,
      subject: "WoCommerce Password Recovery ",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    next(new CatchError(error.message, 500));
  }
});

exports.resetPassword = tryCatchError(async function (req, res, next) {
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  })
  if (!user) {
    return next(new CatchError("Reset Password Token is invalid or expired", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new CatchError("Password doesn't match", 400));
  }
  user.password = req.body.password
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  console.log(req.params.token)
  await user.save()
  sendToken(user, 200, res)
})

// getUserDetails
exports.getUserDetails = tryCatchError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  console.log(user);
  res.status(200).json({
    success: true,
    user,
  });
});

// UpdatePassword
exports.updatePassword = tryCatchError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatch = await user.comparePassword(req.body.oldPassword);
  console.log(user);
  if (!isPasswordMatch) {
    return next(new CatchError("old Password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new CatchError("Password does not match", 400));
  }
  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 200, res);
});

//updateProfile  
exports.updateProfile = tryCatchError(async(req,res,next)=>{
  const newUserData ={
    name:req.body.name,
    email:req.body.email,
  }
  // we will add cloudinary later
  const user = await User.findByIdAndUpdate(req.user.id,newUserData, {
    new:true,
    runValidators:true,
    useFindAndModify:false
  })
  res.status(200).json({
    success:true,
    user
  })

})