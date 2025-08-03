require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const feedbackRoutes = require('./routes/feedback');
const profileRoutes = require('./routes/profile');

const app = express();
const frontendPath = path.join(__dirname, '..', 'FRONTEND');

app.use(cors());
app.use(express.json());

app.use(express.static(frontendPath));

app.use('/api/auth', authRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/profile', profileRoutes);

const servePage = (pageName) => {
    return (req, res) => {
        res.sendFile(path.join(frontendPath, 'HTML', pageName));
    };
};

app.get('/', servePage('login.html'));
app.get('/login.html', servePage('login.html'));
app.get('/cadastro.html', servePage('cadastro.html'));
app.get('/perfil.html', servePage('perfil.html'));
app.get('/formulario.html', servePage('formulario.html'));
app.get('/quemsomos.html', servePage('quemsomos.html'));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor e Aplicação a correr em http://localhost:${PORT}`);
});