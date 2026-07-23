import userModel from "../models/user.model.js"
import bcrypt from "bcrypt"
import config from "../config/config.js"
import jwt from "jsonwebtoken"

export const handleRegister = async (req, res) => {
    const { username, email, password, name, about_yourSelf } = req.body;

    if (!username || !email || !password|| !name) {
        return res.status(404).json({ msg: "all fields are required" });
    }

    const isAlreadyRegistered = await userModel.findOne({
        $or: [
            { username: username },
            { email: email }
        ]
    })

    if (isAlreadyRegistered) {
        return res.status(409).json({
            msg: "User already registered "
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username: username,
        email: email,
        name: name,
        password: hashedPassword,
        about_yourSelf: about_yourSelf
    })

    // accessToken 
    const accessToken = await jwt.sign({
        id: user._id
    }, config.JWT_SECRET,
        {
            expiresIn: '30m'
        }
    )

    // refreshToken
    const refreshToken = await jwt.sign({
        id: user._id
    }, config.JWT_SECRET,
        {
            expiresIn: '7d'
        }
    )

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(201).json({
        msg: "user created successfully",
        data: user.data,
        accessToken: accessToken
    })

}

export const handleLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(404).json({
            msg: "email and password required"
        })
    }

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(401).json({
            msg: "Invalid Credentials"
        })
    }

    const isValidUser = await bcrypt.compare(password, user.password);

    if (!isValidUser) {
        return res.status(401).json({
            msg: "Invalid Credentials"
        })
    }

    // accessToken 
    const accessToken = await jwt.sign({
        id: user._id
    }, config.JWT_SECRET,
        {
            expiresIn: '30m'
        }
    )

    // refreshToken
    const refreshToken = await jwt.sign({
        id: user._id
    }, config.JWT_SECRET,
        {
            expiresIn: '7d'
        }
    )

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(201).json({
        msg: "user logged in successfully",
        data: user.data,
        accessToken: accessToken
    })
}

export const handleGetMe = async (req, res) => {
    try {
        // Grab the access token.
        const access_token = req.headers.authorization?.split(" ")[1];

        // Check if token exist.
        if (!access_token) {
            return res.status(404).json({
                msg: "token not found"
            })
        }

        //verify token
        console.log('Exact token recieved: ', access_token);
        const decoded = jwt.verify(access_token, config.JWT_SECRET);

        // Retrieve user details from database (excluding the password)
        const user = await userModel.findById(decoded.id).select("-password");

        return res.status(201).json({
            msg: "access token recieved",
            decoded: decoded,
            user: user
        })
    } catch (error) {
        return res.status(500).json({ msg: "server error", error: error.message });
    }
}

export const handleRefreshToken = async (req, res) => {
    try {
        const refresh_token = req.cookies.refreshToken;

        if (!refresh_token) {
            return res.status(404).json({
                msg: "Refresh Token not found"
            })
        }

        const decoded = jwt.verify(refresh_token, config.JWT_SECRET);

        // accessToken 
        const accessToken = await jwt.sign({
            id: decoded.id
        }, config.JWT_SECRET,
            {
                expiresIn: '30m'
            }
        )

        // refreshToken
        const new_refreshToken = await jwt.sign({
            id: decoded.id
        }, config.JWT_SECRET,
            {
                expiresIn: '7d'
            }
        )

        res.cookie("refreshToken", new_refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            msg: "user created successfully",
            decoded: decoded
        })
    } catch (error) {
        console.log('Error: ', error);
    }

}
