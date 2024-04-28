module.exports.handleOrFail = (errorMessage) => {
  return () => {
    const error = new Error(errorMessage);
    error.statusCode = 404;
    throw error;
  };
};
