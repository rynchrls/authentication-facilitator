const jwt = require("jsonwebtoken");
const DEFAULT_EXPIRATION = 3600; // 1 hour

/**
 * Generates a JWT token.
 * @param {Object} payload - The user data to encode in the token.
 * @param {string} secret - The secret key for signing the token.
 * @param {string} expiresIn - Token expiration time (e.g., '1h', '7d').
 * @returns {string} - The generated JWT token.
 */
const buildToken = (payload, secret, expiresIn = '1h') => {
  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Verifies a JWT token and returns the decoded payload.
 * @param {string} token - The JWT token to verify.
 * @param {string} secret - The secret key used to sign the token.
 * @returns {Object|null} - The decoded token payload or null if invalid.
 */
const authenticateToken = async (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

/**
 * Decodes a JWT token without verifying the signature.
 * @param {string} token - The JWT token to decode.
 * @returns {Object|null} - The decoded payload or null if invalid.
 */
const resolveToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

/**
 * Express Middleware to protect routes using JWT.
 * @param {string} secret - The secret key for verification.
 * @returns {Function} - Express middleware function.
 */
const enforceJWT = (secret) => {
  return async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ error: "Access Denied: No Token Provided" });
    }

    const verified = await authenticateToken(token, secret);
    if (!verified) {
      return res.status(403).json({ error: "Invalid or Expired Token" });
    }

    req.user = verified; // Attach user data to request
    next();
  };
};

module.exports = {
  buildToken,
  authenticateToken,
  resolveToken,
  enforceJWT,
};
