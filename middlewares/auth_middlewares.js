import jsonwebtoken, { decode } from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).send({
      message: "A token is required for authentication",
    });
  }

  const _token = token.split(" ")[1];

  const { exp } = decode(_token);
  if (Date.now() >= exp * 1000) {
    return res.status(401).send({
      message: "Token is expired",
    });
  }
  
  try {
    const decoded = jsonwebtoken.verify(_token, process.env.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send({
      message: "Invalid Token",
    });
  }
  
  return next();
};

export default verifyToken