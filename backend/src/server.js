// backend/src/server.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './config/supabaseClient.js';

// ---> NOVO: Importar os módulos 'path' e 'url' do Node.js
import path from 'path';
import { fileURLToPath } from 'url';

// Rotas
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// ---> NOVO: Lógica para encontrar o caminho correto para a pasta FRONTEND
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Isso nos dá o caminho absoluto para a pasta 'backend/src'
// Usamos 'path.join' para voltar dois níveis (de /src para /backend, de /backend para a raiz) e então entrar em /FRONTEND
const frontendPath = path.join(__dirname, '..', '..', 'FRONTEND');


// Middlewares
app.use(cors());
app.use(express.json());

// ---> NOVO E ESSENCIAL: Middleware para servir arquivos estáticos
// Diz ao Express: "Qualquer arquivo que for pedido, procure primeiro dentro da pasta 'frontendPath' que definimos"
// Agora, o Express vai servir seus CSS, JS e imagens automaticamente.
app.use(express.static(frontendPath));

/*
=================================================
 SUAS ROTAS DE API FICAM DEPOIS DO STATIC
=================================================
*/

// Rotas Públicas da API (ex: /api/auth/login)
app.use('/api/auth', authRoutes);

// Rotas Protegidas da API (ex: /api/profile)
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
app.use('/api/profile', authMiddleware, profileRoutes);


// ---> NOVO: Rota principal para servir a tela inicial
// Quando alguém acessar a raiz do seu site ('http://localhost:3000/'),
// envie o arquivo 'telainicial.html' como resposta.
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'HTML', 'telainicial.html'));
});


app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando. Acesse: http://localhost:${PORT}`);
});