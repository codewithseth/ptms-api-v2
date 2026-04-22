export const errorHandler = (err, req, res, next) => {
  // Log out the status code before we change it
  console.log("Status code is: ", res.statusCode);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
