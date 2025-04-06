const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const NodeCache = require('node-cache');
const path = require('path');

const app = express();
const cache = new NodeCache({ stdTTL: 60 }); // Кэш на 1 минуту

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use(session({
    secret: 'ABOBA',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 часа
    }
}));

// Временное хранилище пользователей 
const users = new Map();

// Middleware для проверки авторизации
const authMiddleware = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};

// Роуты
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    
    if (users.has(username)) {
        return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.set(username, { password: hashedPassword });
    
    res.json({ message: 'Registration successful' });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.get(username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.userId = username;
    res.json({ message: 'Login successful' });
});

app.get('/profile', authMiddleware, (req, res) => {
    res.json({ username: req.session.userId });
});

app.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logout successful' });
});

app.get('/data', authMiddleware, (req, res) => {
    const cachedData = cache.get('apiData');
    if (cachedData) {
        return res.json(cachedData);
    }

    // Генерация новых данных
    const newData = {
        timestamp: new Date(),
        randomValue: Math.random()
    };

    cache.set('apiData', newData);
    res.json(newData);
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

