import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "30d" });
};

export const register = async (req, res) => {
    const { username, password } = req.body;
    try {
        const userExists = await User.findOne({username});
        if (userExists) 
            return res.status(400).json({message: "[Info][Not successfull] Username already exists" });

        const user = await User.create({username, password});
        res.status(201).json({
            _id: user._id,
            username: user.username,
            token: generateToken(user._id),
        });
    } catch (err) {
        res.status(500).json({message: `[Error] ${err.message}`});
    }
};

export const login = async (req, res) => {
    const {username, password} = req.body;
    try {
        const user = await User.findOne({username});
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({message: "[Info][Not success] Invalid credentials"});
        }
    } catch (err) {
        res.status(500).json({message: `[Error] ${err.message}`});
    }
};