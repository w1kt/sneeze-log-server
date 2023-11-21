import uuidv4 from "uuid/v4";

const transcationIdMiddleware = (req, res, next) => {
  req.transactionId = uuidv4();
  next();
};

export default transcationIdMiddleware;
