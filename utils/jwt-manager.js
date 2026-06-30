const jwt = require('jsonwebtoken');

const SECRET_KEY = 'ESTUDOS_ANGULAR';

const generateTokenOnLogin = (username) => {
    return jwt.sign({ username }, SECRET_KEY, { expiresIn: 300 });
}

const validateToken = (token) => {
    return jwt.verify(token, SECRET_KEY);
}

module.exports = { generateTokenOnLogin, validateToken };
