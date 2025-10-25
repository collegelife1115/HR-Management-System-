const notFound = (req, res, next) => {
  // Catch 404 errors for non-existent routes
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// General error handler middleware
const errorHandler = (err, req, res, next) => {
  // Set the status code. If a status code was set (e.g., 400), use it.
  // Otherwise, default to 500 (Server Error).
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  // Send a JSON response with the error message and stack trace (in dev mode)
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
