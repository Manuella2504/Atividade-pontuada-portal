// Arquivo: backend/routes/auth.js

const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// DENTRO DE backend/routes/auth.js

router.post('/register', async (req, res) => {
    // 1. Receber TODOS os dados do corpo da requisição
    const { email, password, primeiroNome, sobrenome, dataNascimento, paisNascimento, cpf } = req.body;

    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (authError) {
        return res.status(400).json({ error: authError.message });
    }

    if (!authData.user) {
        return res.status(400).json({ error: "Usuário não criado. Tente novamente." });
    }

    // 2. Inserir TODOS os dados recebidos no banco
    const { error: profileError } = await supabase
        .from('profiles')
        .insert({
            id: authData.user.id,
            primeiro_nome: primeiroNome,
            sobrenome: sobrenome,
            data_nascimento: dataNascimento,
            pais_nascimento: paisNascimento, // <-- DADO ADICIONADO
            cpf: cpf
        });

    if (profileError) {
        return res.status(400).json({ error: profileError.message });
    }

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!', user: authData.user });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ message: 'Login realizado com sucesso!', session: data.session, user: data.user });
});

module.exports = router;