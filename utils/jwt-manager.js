const jwt = require('jsonwebtoken');

const SECRET_KEY = 'ESTUDOS_ANGULAR';

const generateTokenOnLogin = (username) => {
    return jwt.sign({ username }, SECRET_KEY, { expiresIn: 300 });
}

const validateToken = (token) => {
    if(!token) {
        return false;
    }

    try {
        return jwt.verify(token, SECRET_KEY);
    } catch(error) {
        console.error('Erro na validação do Token:', error.message);
        return null;
    }
}

module.exports = { generateTokenOnLogin, validateToken };
