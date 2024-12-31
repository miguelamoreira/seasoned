const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { JWTconfig } = require("../config/db.config.js");


exports.tokenVal = (req, res, next) => {
    try {
        const header = req.headers['x-access-token'] || req.headers.authorization;

        if (typeof header == 'undefined')
            if (err.name === 'JsonWebTokenError')
                return res.status(401).json({
                    success: false, 
                    msg: "No token provided"
                });

        let token, bearer = header.split(' ');
        if (bearer.length == 2)
            token = bearer[1];
        else
            token = header;

        let decoded = jwt.verify(token, JWTconfig.SECRET);
        req.loggedusersId = decoded.id;
        next();

    } catch (err) {
        if (err.name === 'TokenExpiredError')
            return res.status(401).json({
                success: false, 
                msg: `Your token has expired! Please login again.`
            });

        if (err.name === 'JsonWebTokenError')
            return res.status(401).json({
                success: false, 
                msg: "Malformed JWT! Please login again."
            });
    }
};

exports.isAdmin = async (req, res, next) => {
    if (req.loggedusersRole === "admin")
        return next();


    return res.status(403).json({
        success: false, 
        msg: "This request requires ADMIN role!"
    });
};

exports.isAdminOrLoggedusers = async (req, res, next) => {
    if (req.loggedusersRole === "admin" || req.loggedusersId == req.params.usersID)
        return next();

    next(new ErrorHandler(403, "This request requires an ADMIN Role or you can only see you own data!"));
};


