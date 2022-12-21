export const notFoundHandler = (error, request, response, next) => {
  if (error.status === 404) {
    response.status(404).send({ message: error.message });
  } else {
    next(error);
  }
};
export const badRequestHandler = (error, request, response, next) => {
  if (error.status === 400) {
    response
      .status(400)
      .send({
        message: error.message,
        list: error.errorsList.map((e) => e.msg),
      });
  } else {
    next(error);
  }
};
export const unauthorizedHandler = (error, request, response, next) => {
  if (error.status === 401) {
    response.status(401).send({ message: error.message });
  } else {
    next(error);
  }
};

export const genericErrorHandler = (error, request, response, next) => {
  console.log("ERROR RECEIVED FROM UP ABOVE:", error);
  response.status(500).send({ message: "An error occurred on our side" });
};
