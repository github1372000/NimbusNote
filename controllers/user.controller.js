import { User } from "../models/user.models.js";
import { generateHash, compareHash } from "../utils/generateHash.js";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();

const registerUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email) return res.status(400).json({ error: "Email is required" });
    if (!name) return res.status(400).json({ error: "Full-name is required" });
    if (!password)
      return res.status(400).json({ error: "Password is required" });

    const existedUser = await User.findOne({ email });
    if (existedUser) {
      res.status(500).json({ error: "User is already exists with this email" });
    }

    const hashedPassword = await generateHash(password);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).send({
        success: false,
        message: "email is required",
      });
    }

    const user = await User.findOne({email});

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User does not exist",
      });
    }

    const isPasswordValid = await compareHash(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).send({
        success: false,
        message: "Invalid password",
      });
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    const token = JWT.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });


    res.status(200).send({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false, 
      message: "Error in login",
      error: error.message,
    });
  }
};

export { registerUser, login };
