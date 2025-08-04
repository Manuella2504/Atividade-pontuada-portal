// src/controllers/profileController.js
import { supabase } from '../config/supabaseClient.js';

// Função para buscar TODOS os dados do perfil de uma vez
export const getProfile = async (req, res) => {
    const userId = req.user.id;

    // Busca o perfil principal
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (profileError) return res.status(404).json({ error: 'Perfil não encontrado.' });

    // Busca as formações
    const { data: formacao } = await supabase.from('formacao').select('*').eq('user_id', userId);
    // Busca as experiências
    const { data: experiencia } = await supabase.from('experiencia').select('*').eq('user_id', userId);
    // Busca os idiomas
    const { data: idiomas } = await supabase.from('idiomas').select('*').eq('user_id', userId);

    // Junta tudo em um único objeto de resposta
    res.status(200).json({
        personalInfo: profile,
        education: formacao || [],
        experience: experiencia || [],
        languages: idiomas || []
    });
};

// Função para ATUALIZAR informações pessoais
export const updatePersonalInfo = async (req, res) => {
    const userId = req.user.id;
    const { primeiro_nome, sobrenome, celular } = req.body;

    const { data, error } = await supabase
        .from('profiles')
        .update({ primeiro_nome, sobrenome, celular })
        .eq('id', userId)
        .select();

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
};

// Função genérica para ADICIONAR um item (formação, experiência, etc.)
export const addItem = async (req, res) => {
    const userId = req.user.id;
    const { table } = req.params; // 'formacao', 'experiencia', 'idiomas'
    const itemData = { ...req.body, user_id: userId };

    const { data, error } = await supabase
        .from(table)
        .insert([itemData])
        .select();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
};

// Função genérica para DELETAR um item
export const deleteItem = async (req, res) => {
    const userId = req.user.id;
    const { table, id } = req.params;

    const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)
        .eq('user_id', userId); // Garante que o usuário só pode deletar seus próprios itens

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: 'Item removido com sucesso.' });
};