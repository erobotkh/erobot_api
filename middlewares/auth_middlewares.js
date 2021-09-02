import jsonwebtoken from 'jsonwebtoken'
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
  
  try {
    const decoded = jsonwebtoken.verify(_token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send({
      message: "Invalid Token",
    });
  }
  
  return next();
};

export default verifyToken