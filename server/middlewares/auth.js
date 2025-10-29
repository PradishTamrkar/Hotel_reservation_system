// const jwt = require("jsonwebtoken")

// const SECRET_KEY = process.env.JWT_SECRET
// const EXPIRES_IN = process.env.JWT_EXPIRES_IN
// const NODE_ENV = process.env.NODE_ENV
// //token creation
// const generateToken = (payload) => {
//     return jwt.sign(payload, SECRET_KEY,{expiresIn: EXPIRES_IN})
// }

// //send token as cookie
// const sendAuthCookie = (res, token) => {
//     res.cookie("token", token, {
//         httpOnly:true,
//         secure: NODE_ENV,
//         sameSite: "strict",
//         maxAge: 24 * 60 * 60 * 1000
//     })
// }
// //token verification
// const verifyToken = (req,res,next) => {
//     const authHead = req.headers["authorization"]
//     if(!authHead)
//     {
//         req.user = { role: "guest" }
//         return next()
//     }
//     //customer and admin
//     const token = authHead.split(" ")[1]
//     if(!token){
//         return res.status(401).json({error:"No token provided"})
//     }

//     jwt.verify(token, SECRET_KEY, (err,decoded) => {
//         if(err){
//             return res.status(401).json({error: "Invalid token"})
//         }
//         req.user = decoded
//         next()
//     })
// }

// //for admin-access only
// const adminOnly = (req,res,next) => {
//     console.log('Admin check:', req.user);
//     if(req.user && req.user.role === "admin") {
//         return next()
//     }
//     return res.status(403).json({error: "unauthorized"})
// }

// //for customer only
// const customerOnly = (req,res,next) => {
//     console.log('Customer check:', req.user);
//     if(req.user && req.user.role === "customer") {
//         return next()
//     }
//     return res.status(403).json({error: "unauthorized"})
// }

// const allowCustomerOrGuest = (req, res, next) => {
//     console.log('Customer/Guest check:', req.user);
//     if (req.user && (req.user.role === "customer" || req.user.role === "guest")) {
//         return next();
//     }
//     return res.status(403).json({ error: "unauthorized" });
// };

// exports.generateToken = generateToken
// exports.verifyToken = verifyToken
// exports.adminOnly = adminOnly
// exports.customerOnly = customerOnly
// exports.allowCustomerOrGuest = allowCustomerOrGuest
// exports.sendAuthCookie = sendAuthCookie

const jwt = require("jsonwebtoken");
const { jwt: jwtConfig } = require("../config/config");

const { generateToken, cookieOptions, JWT_SECRET } = jwtConfig;

// Create token
const sendAuthCookie = (res, token) => {
  res.cookie("token", token, cookieOptions);
};

// Verify token and assign user role
const verifyToken = (req, res, next) => {
  const authHead = req.headers["authorization"];

  // If no token -> treat as guest
  if (!authHead) {
    req.user = { role: "guest" };
    return next();
  }

  const token = authHead.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });

    req.user = decoded;
    next();
  });
};

// Admin only
const adminOnly = (req, res, next) => {
  console.log("Admin check:", req.user);
  if (req.user && req.user.role === "admin") return next();
  return res.status(403).json({ error: "unauthorized" });
};

// Customer only
const customerOnly = (req, res, next) => {
  console.log("Customer check:", req.user);
  if (req.user && req.user.role === "customer") return next();
  return res.status(403).json({ error: "unauthorized" });
};

// Allow customer or guest
const allowCustomerOrGuest = (req, res, next) => {
  console.log("Customer/Guest check:", req.user);
  if (req.user && (req.user.role === "customer" || req.user.role === "guest"))
    return next();
  return res.status(403).json({ error: "unauthorized" });
};

module.exports = {
  generateToken,
  sendAuthCookie,
  verifyToken,
  adminOnly,
  customerOnly,
  allowCustomerOrGuest,
};
