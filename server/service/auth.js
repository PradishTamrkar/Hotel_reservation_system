const jwt = require("jsonwebtoken")

const SECRET_KEY = process.env.JWT_SECRET
const EXPIRES_IN = process.env.JWT_EXPIRES_IN

//token creation
const generateToken = (payload) => {
    return jwt.sign(payload, SECRET_KEY,{expiresIn: EXPIRES_IN})
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
    if(req.user && req.user.role === "admin") {
        return next()
    }
    return res.status(403).json({error: "unauthorized"})
}

//for customer and guest access only
const customerOrGuest = (req,res,next) => {
    if(req.user && (req.user.role === "customer" || req.user.role === "guest")) {
        return next()
    }
    return res.status(403).json({error: "unauthorized"})
}

exports.generateToken = generateToken
exports.verifyToken = verifyToken
exports.adminOnly = adminOnly
exports.customerOrGuest = customerOrGuest

