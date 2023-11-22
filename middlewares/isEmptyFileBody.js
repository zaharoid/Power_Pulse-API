import { HttpErr } from "../helpers/index.js";

const isEmptyFileBody = (req, res, next) => {
  if (!req.file) {
    throw HttpErr(400, "missing fields");
  }
  next();
};

export default isEmptyFileBody;
