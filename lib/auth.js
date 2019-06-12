/*
 * Auth stuff.
 */

const jwt = require('jsonwebtoken');
const { getUser } = require('../models/user');

const secretKey = 'SuperSecret!';

exports.generateAuthToken = function (userId) {
  const payload = {
    sub: userId
  };
  const token = jwt.sign(payload, secretKey, { expiresIn: '24h' });
  return token;
};

exports.requireAuthentication = async function (req, res, next) {
  const authHeader = req.get('Authorization') || '';
  if(!authHeader){
    next();
  }
  else{
    const authHeaderParts = authHeader.split(' ');
    const token = authHeaderParts[0] === 'Bearer' ? authHeaderParts[1] : null;

    try {
      const payload = jwt.verify(token, secretKey);
      const admin = await getUser(payload.sub, null);
      req.user = admin[0].id;
      req.role = admin[0].role;
      if(admin[0].role === "admin"){
        req.admin = 1;
      }
      next();
    } catch (err) {
      console.error("  -- error:", err);
      res.status(401).send({
        error: "Invalid authentication token provided."
      });
    }
  }
};
