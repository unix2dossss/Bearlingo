import rateLimit from "express-rate-limit";

// 1. Define the Rate Limiter Middleware
export const dailyRequestLimiter = rateLimit({
  // Use a unique identifier for the user (like their ID) to track requests
  // This must be set to 'user._id' in this case because your endpoint uses 'req.user._id'
  keyGenerator: (req, res) => {
    return req.user._id.toString();
  },
  // Window of time to track requests (1 day = 24 * 60 * 60 * 1000 ms)
  windowMs: 24 * 60 * 60 * 1000,
  max: 2,
  // Message to send when the limit is exceeded
  message: (req, res) => {
    return res.status(429).json({
      error: `Daily CV analysis limit reached. Please try again tomorrow.`
    });
  },
  // Standard HTTP status code for too many requests
  statusCode: 429,
  // Set headers to show remaining and reset time
  standardHeaders: true,
  legacyHeaders: false
});
