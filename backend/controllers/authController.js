const bcrypt = require("bcrypt");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// signup

const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed, name });

    res.json({
      message: "User signed up successfully",
      token: generateToken(user.id),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//signin

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user.id);

    res.json({ user: { name: user.name, email: user.email }, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { signup, login };
