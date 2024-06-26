module.exports = (res, error) => {
  console.error('error-', error);
  res.status(error.status ? error.status : 500).json({
    success: false,
    message: error.message ? error.message : error,
  });
};
