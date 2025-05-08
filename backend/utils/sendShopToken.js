const sendShopToken = (shop, statusCode, res) => {
    // Generate JWT token from User model method
    const token = shop.getJwtToken();
  
    // Remove password before sending the response
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
      shop,
      // token,
    });
  };
  
  module.exports = sendShopToken;
  