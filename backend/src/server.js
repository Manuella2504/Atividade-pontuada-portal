// src/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './config/supabaseClient.js';

// Rotas
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Permite requisições do seu frontend
app.use(express.json());

// Middleware de Autenticação
const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Acesso não autorizado' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        return res.status(401).json({ error: 'Token inválido' });
    }
    
    req.user = user;
    next();
};

// Rotas Públicas
app.use('/api/auth', authRoutes);

// Rotas Protegidas
app.use('/api/profile', authMiddleware, profileRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});