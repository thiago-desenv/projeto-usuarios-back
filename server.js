const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { USERS_LIST_BD } = require('./utils/users-list-bd');
const { generateTokenOnLogin } = require('./utils/jwt-manager');
const { authenticateToken } = require('./middlewares/authenticate-token');

const app = express();
const PORT = 3000;

// Middleware para analisar o corpo das requisições
app.use(bodyParser.json());

// Usar o middleware cors para permitir todas as origens
app.use(cors());

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const USER_FOUND = 
        USERS_LIST_BD.find(user => user.username === username && user.password === password);

    if(!USER_FOUND) {
        return res.status(401).json({ menssage: 'Invalid credentials' });
    }

    //gerar o token
    const userToken = generateTokenOnLogin(username);
    return res.json({ token: userToken });
});

app.post('/validate-token', authenticateToken, (req, res) => {
    res.json({ message: 'Token válido', username: res.username });
});

app.put('/update-user', (req, res) => {
    const { originalName, name, email, username, password } = req.body;
    if(!(name && email && username && password)) {
        return res.status(401).json({ message: 'user data not provided' })
    }

    const USER_FOUND = 
        USERS_LIST_BD.find(user => user.username === originalName);
    if(!USER_FOUND) {
        return res.status(404).json({ message: 'User not found' });
    }

    USER_FOUND.email = name;
    USER_FOUND.email = email;
    USER_FOUND.username = username;
    USER_FOUND.password = password;

    return res.json({ USER_FOUND });
});

app.listen(PORT, () => {
    console.log(`O Servidor está rodando no http://localhost:${PORT}`);
});
