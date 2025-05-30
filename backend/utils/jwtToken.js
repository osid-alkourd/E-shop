const sendToken = (user, statusCode, res) => {
  // Generate JWT token from User model method
  const token = user.getJwtToken();

  // Remove password before sending the response
  user.password = undefined;
  // Options for the cookie
  const options = {
    expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days
    httpOnly: true,
    secure: false, // secure in production
    sameSite: "strict", // helps protect against CSRF
    // domain: 'localhost' // Change to your domain in production
  };

  // Send token in cookie
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendToken;
