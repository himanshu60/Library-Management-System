const rateLimit = require('express-rate-limit');

// Rate limiting for user login and registration
const Limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Max 5 requests per IP per hour
  message:
    "Too many attempts from this IP. Please wait for 1 hour and then try again.",
});


module.exports = {Limiter};
