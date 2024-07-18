const errorHandler = (err, req, res, next) => {
  // Determine the status code. If the status code is 200 (OK), change it to 500 (Internal Server Error).
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Set the response status code.
  res.status(statusCode);

  // Send a JSON response containing the error message and stack trace.
  res.json({
    message: err.message,
    stack: err.stack,
  });
};

module.exports = errorHandler;
