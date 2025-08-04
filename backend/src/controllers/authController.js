// src/controllers/authController.js
import { supabase } from '../config/supabaseClient.js';

export const registerUser = async (req, res) => {
    const { email, password, primeiroNome, sobrenome, dataNascimento, paisNascimento, cpf } = req.body;

    // 1. Criar o usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
    });

    if (authError) {
        return res.status(400).json({ error: authError.message });
    }

    if (!authData.user) {
        return res.status(400).json({ error: "Usuário não criado. Tente novamente." });
    }

    // 2. Inserir os dados pessoais na tabela 'profiles'
    const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
            id: authData.user.id,
            primeiro_nome: primeiroNome,
            sobrenome: sobrenome,
            data_nascimento: dataNascimento,
            pais_nascimento: paisNascimento,
            cpf: cpf,
            email: email
        }]);
    
    if (profileError) {
        // Opcional: deletar o usuário do auth se a inserção no perfil falhar
        await supabase.auth.admin.deleteUser(authData.user.id);
        return res.status(500).json({ error: `Erro ao salvar perfil: ${profileError.message}` });
    }

    res.status(201).json({ message: 'Cadastro realizado com sucesso! Verifique seu e-mail para confirmação.', session: authData.session });
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    res.status(200).json({ message: 'Login bem-sucedido!', session: data.session });
};

// Adicione esta função ao src/controllers/authController.js
import { sendContactEmail } from '../services/emailService.js';

export const handleContactForm = async (req, res) => {
    try {
        await sendContactEmail(req.body);
        res.status(200).json({ message: 'Formulário enviado com sucesso!' });
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        res.status(500).json({ error: 'Falha ao enviar o formulário.' });
    }
};