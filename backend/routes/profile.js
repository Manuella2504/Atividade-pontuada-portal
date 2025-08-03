const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ error: 'Token de autorização necessário.' });
    }
    const token = authorization.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) {
        return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }
    req.user = user;
    next();
};

router.get('/', requireAuth, async (req, res) => {
    const userId = req.user.id;
    
    // --- PISTAS DE DEPURAÇÃO ---
    console.log('--- INICIANDO BUSCA DE PERFIL NO BACKEND ---');
    console.log('ID do utilizador recebido do token:', userId);

    try {
        const { data: profileData, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        // --- MAIS PISTAS ---
        if (profileError) {
            console.error('Erro ao buscar da tabela "profiles":', profileError.message);
        }
        console.log('Dados encontrados na tabela "profiles":', profileData);


        if (!profileData) {
             console.log('AVISO: Nenhum perfil encontrado para este ID. A devolver dados vazios.');
        }

        const { data: formacoesData } = await supabaseAdmin.from('formacoes').select('*').eq('user_id', userId);
        const { data: experienciasData } = await supabaseAdmin.from('experiencias').select('*').eq('user_id', userId);
        const { data: idiomasData } = await supabaseAdmin.from('habilidades_linguisticas').select('*').eq('user_id', userId);

        const fullProfile = {
            personalInfo: profileData || {},
            education: formacoesData || [],
            experience: experienciasData || [],
            languages: idiomasData || []
        };
        
        fullProfile.personalInfo.email = req.user.email;
        console.log('--- ENVIANDO RESPOSTA PARA O FRONTEND ---');
        res.status(200).json(fullProfile);

    } catch (error) {
        console.error("ERRO GERAL na rota de perfil:", error);
        res.status(500).json({ error: 'Erro interno ao buscar os dados do perfil.' });
    }
});

// O resto do ficheiro (rotas PUT, POST, DELETE) permanece igual...
router.put('/info', requireAuth, async (req, res) => {
    const { data, error } = await supabaseAdmin.from('profiles').update(req.body).eq('id', req.user.id).select();
    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json({ message: 'Informações atualizadas!', data });
});
function createCrudRoutes(router, tableName) {
    router.post(`/${tableName}`, requireAuth, async (req, res) => {
        const { data, error } = await supabaseAdmin.from(tableName).insert({ ...req.body, user_id: req.user.id }).select();
        if (error) return res.status(500).json({ error: error.message });
        res.status(201).json({ message: 'Item adicionado com sucesso!', data: data[0] });
    });
    router.delete(`/${tableName}/:id`, requireAuth, async (req, res) => {
        const { error } = await supabaseAdmin.from(tableName).delete().eq('id', req.params.id).eq('user_id', req.user.id);
        if (error) return res.status(500).json({ error: error.message });
        res.status(200).json({ message: 'Item removido com sucesso!' });
    });
}
createCrudRoutes(router, 'formacoes');
createCrudRoutes(router, 'experiencias');
createCrudRoutes(router, 'habilidades_linguisticas');

module.exports = router;