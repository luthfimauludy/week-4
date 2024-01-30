const errorHandler = (res, error) => {
  if (error === undefined) {
    return res.status(404).json({
      success: false,
      message: "Error: User not found!",
    });
  }

  if (error?.message?.includes("Unexpected token")) {
    return res.status(401).json({
      success: false,
      message: "Error: Unexpected token",
    });
  }

  console.log(error);
  return res.status(500).json({
    success: false,
    message: "Error: Internal server error!",
  });
};

module.exports = errorHandler;
