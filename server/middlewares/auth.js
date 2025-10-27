const jwt = require("jsonwebtoken")

const SECRET_KEY = process.env.JWT_SECRET
const EXPIRES_IN = process.env.JWT_EXPIRES_IN
const NODE_ENV = process.env.NODE_ENV
//token creation
const generateToken = (payload) => {
    return jwt.sign(payload, SECRET_KEY,{expiresIn: EXPIRES_IN})
}

//send token as cookie
const sendAuthCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly:true,
        secure: NODE_ENV,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000
    })
}
//token verification
//guest
const verifyToken = (req,res,next) => {
    const authHead = req.headers["authorization"]
    if(!authHead)
    {
        req.user = { role: "guest" }
        return next()
    }
    //customer and admin
    const token = authHead.split(" ")[1]
    if(!token){
        return res.status(401).json({error:"No token provided"})
    }

    jwt.verify(token, SECRET_KEY, (err,decoded) => {
        if(err){
            return res.status(401).json({error: "Invalid token"})
        }
        req.user = decoded
        next()
    })
}

//for admin-access only
const adminOnly = (req,res,next) => {
    console.log('Admin check:', req.user);
    if(req.user && req.user.role === "admin") {
        return next()
    }
    return res.status(403).json({error: "unauthorized"})
}

//for customer only
const customerOnly = (req,res,next) => {
    console.log('Customer check:', req.user);
    if(req.user && req.user.role === "customer") {
        return next()
    }
    return res.status(403).json({error: "unauthorized"})
}

// const guestOnly = (req,res,next) => {
//     console.log('Guest check:', req.user);
//     if(req.user.role === "guest") {
//         return next()
//     }
//     return res.status(403).json({error: "unauthorized"})
// }

const allowCustomerOrGuest = (req, res, next) => {
    console.log('Customer/Guest check:', req.user);
    if (req.user && (req.user.role === "customer" || req.user.role === "guest")) {
        return next();
    }
    return res.status(403).json({ error: "unauthorized" });
};

exports.generateToken = generateToken
exports.verifyToken = verifyToken
exports.adminOnly = adminOnly
exports.customerOnly = customerOnly
// exports.guestOnly = guestOnly
exports.allowCustomerOrGuest = allowCustomerOrGuest
exports.sendAuthCookie = sendAuthCookie

