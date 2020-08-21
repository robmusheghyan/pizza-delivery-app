module.exports.writeStatus = function(response, error, data) {
  const status = data.status || (error ? 401 : 200);
  return response.status(status).json({
    error,
    ...data
  });
};
