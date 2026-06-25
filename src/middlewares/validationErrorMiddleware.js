/**
 * Middleware to handle validation errors
 * @param {Object} err - The error object.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function.
 */
const validationErrorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  // Mongoose ValidationError handling
  if (err.name === 'ValidationError') {
    const validationErrors = {};
    Object.keys(err.errors).forEach(field => {
      validationErrors[field] = err.errors[field].message;
    });
    // Add field-specific errors to the error object
    err.statusCode = 400;
    err.validationErrors = validationErrors;
    err.message = 'Validation failed';
    return next(err);
  }
  // Mongoose CastError (example: invalid ObjectId)
  if (err.name === 'CastError') {
    err.statusCode = 400;
    err.message = `Invalid ${err.path}: ${err.value}`;
    return next(err);
  }
  // MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    err.statusCode = 409;
    err.message = `${field} already exists with value: ${err.keyValue[field]}`;
    return next(err);
  }
  return next(err); // Move to the next error middleware
}

export default validationErrorHandler;
