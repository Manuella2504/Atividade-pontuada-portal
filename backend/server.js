require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors()); 
app.use(express.json()); 

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) return res.status(400).json({ error: error.message });

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('nome_completo, titulo')
        .eq('id', data.user.id)
        .single();

    if (profileError) return res.status(400).json({ error: profileError.message });

    res.json({ ...data, user: { ...data.user, ...profile } });
});


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

const getUser = async (req) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error("Token não fornecido");

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) throw new Error(error.message);
    if (!user) throw new Error("Usuário não encontrado");

    return user;
};

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});