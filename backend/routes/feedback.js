const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/send', async (req, res) => {
    const { nome, email, telefone, categoria, assunto, mensagem, rating } = req.body;

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true, 
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"${nome}" <${process.env.EMAIL_USER}>`,
        to: 'souplemonpie@gmail.com',
        subject: `Novo Feedback: ${assunto}`,
        html: `
            <h1>Novo Feedback Recebido</h1>
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
        console.error('Erro ao enviar email:', error);
        res.status(500).json({ error: 'Falha ao enviar o feedback.' });
    }
});

module.exports = router;