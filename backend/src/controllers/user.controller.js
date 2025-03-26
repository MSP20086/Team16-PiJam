import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);

    res.status(200).json({ email, role: user.role, token , name: user.name});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const signupUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const user = await User.signup(name, email, password, role);
    const token = createToken(user._id);

    res.status(200).json({ email, role: user.role, token, name: user.name});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
