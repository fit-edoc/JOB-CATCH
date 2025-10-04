import JWT from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config()

const userAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    next("Auth Failed");
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = JWT.verify(token, process.env.JWT_SECERET);
    req.user = { userId: payload.userId };
    next();
  } catch (error) {
    next("Auth Failed");
  }
};

export default userAuth;