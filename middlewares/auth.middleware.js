import JWT from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
  
  const requireLogIn = async (req, res, next) => {
    try {
      const JWT_SECRET = process.env.JWT_SECRET;

      if (!req.headers.authorization) {
        return res.status(401).send("No token provided");
      }
      
  
      const decodedToken = JWT.verify(
          req.headers.authorization,
           JWT_SECRET);
  
      req.user = decodedToken;
      next();
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Invalid token");
    }
  };
  export default requireLogIn;