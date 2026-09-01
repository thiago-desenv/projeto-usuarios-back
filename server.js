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

app.put('/update-user', authenticateToken, (req, res) => {
    const tokenUsername = res.username;
    const { name, email, username, password } = req.body.userInfos;
    console.log('Body', req.body)
    console.log(name, email, username, password);
    if(!(name && email && username && password)) {
        return res.status(400).json({ message: 'User data not provided' })
    }

    const USER_FOUND = USERS_LIST_BD.findIndex((user) => user.username === tokenUsername);
    if(USER_FOUND === -1) {
        return res.status(403).json({ message: 'User not found' });
    }

    USERS_LIST_BD[USER_FOUND].email = name;
    USERS_LIST_BD[USER_FOUND].email = email;
    USERS_LIST_BD[USER_FOUND].username = username;
    USERS_LIST_BD[USER_FOUND].password = password;

    const newToken = generateTokenOnLogin(username);

    return res.json({ message: 'User updated successfuly', token: newToken });
});

app.listen(PORT, () => {
    console.log(`O Servidor está rodando no http://localhost:${PORT}`);
});
