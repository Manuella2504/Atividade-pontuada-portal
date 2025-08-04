require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors()); // Permite que seu frontend acesse a API
app.use(express.json()); // Permite que o servidor entenda JSON

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- ROTAS DE AUTENTICAÇÃO ---

// Rota de Cadastro
app.post('/api/register', async (req, res) => {
    const { email, password, nome_completo } = req.body;

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                nome_completo: nome_completo
            }
        }
    });

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ user: data.user });
});

// Rota de Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) return res.status(400).json({ error: error.message });

    // Pega o perfil junto com os dados de login
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('nome_completo, titulo')
        .eq('id', data.user.id)
        .single();

    if (profileError) return res.status(400).json({ error: profileError.message });

    res.json({ ...data, user: { ...data.user, ...profile } });
});

// --- ROTA DO FORMULÁRIO DE FEEDBACK ---

// Configuração do Nodemailer (transporter)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

app.post('/api/feedback', async (req, res) => {
    const { nome, email, telefone, categoria, assunto, mensagem, rating } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_TO,
        subject: `Novo Feedback (${categoria}): ${assunto}`,
        html: `
            <h2>Novo Feedback Recebido no Portal LabRocket</h2>
            <p><strong>Nome:</strong> ${nome}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Telefone:</strong> ${telefone || 'Não informado'}</p>
            <p><strong>Categoria:</strong> ${categoria}</p>
            <p><strong>Assunto:</strong> ${assunto}</p>
            <p><strong>Avaliação:</strong> ${rating} de 5 estrelas</p>
            <hr>
            <h3>Mensagem:</h3>
            <p>${mensagem}</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Feedback enviado com sucesso!' });
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        res.status(500).json({ error: 'Falha ao enviar o e-mail.' });
    }
});

// --- ROTAS DO PERFIL DO USUÁRIO ---
// Middleware simples para pegar o token e o usuário (em um app real, use libs como 'jsonwebtoken')
const getUser = async (req) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error("Token não fornecido");

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) throw new Error(error.message);
    if (!user) throw new Error("Usuário não encontrado");

    return user;
};

// Rota para pegar dados do perfil
app.get('/api/profile', async (req, res) => {
    try {
        const user = await getUser(req);
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) throw new Error(error.message);
        res.json(data);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

// Rota para atualizar dados do perfil
app.put('/api/profile', async (req, res) => {
    try {
        const user = await getUser(req);
        const { ...profileData } = req.body;

        const { data, error } = await supabase
            .from('profiles')
            .update({ ...profileData, updated_at: new Date() })
            .eq('id', user.id)
            .select()
            .single();

        if (error) throw new Error(error.message);
        res.json(data);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});