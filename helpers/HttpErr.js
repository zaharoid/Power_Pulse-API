const errList = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Firbidden",
  404: "Not found",
  409: "Conflict",
}

const HttpErr = (status, message = errList[status]) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export default HttpErr;
