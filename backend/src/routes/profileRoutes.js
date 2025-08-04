// src/routes/profileRoutes.js
import { Router } from 'express';
import { getProfile, updatePersonalInfo, addItem, deleteItem } from '../controllers/profileController.js';

const router = Router();

// Rota para buscar todos os dados do perfil
router.get('/', getProfile);

// Rota para atualizar os dados pessoais
router.put('/info', updatePersonalInfo);

// Rota genérica para adicionar um item a uma tabela (formacao, experiencia, etc.)
router.post('/:table', addItem);

// Rota genérica para deletar um item de uma tabela
router.delete('/:table/:id', deleteItem);

export default router;