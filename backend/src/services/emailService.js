// src/services/emailService.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail', // Ou outro provedor
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use senha de aplicativo do Gmail
    },
});

export const sendContactEmail = async (formData) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'email-da-equipe@exemplo.com', // E-mail que receberá o contato
        subject: `Novo Contato - ${formData.assunto}`,
        html: `
            <p><strong>Nome:</strong> ${formData.nome}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Telefone:</strong> ${formData.telefone || 'Não informado'}</p>
            <p><strong>Categoria:</strong> ${formData.categoria}</p>
            <p><strong>Avaliação:</strong> ${formData.rating} de 5</p>
            <hr>
            <p><strong>Mensagem:</strong></p>
            <p>${formData.mensagem}</p>
        `,
    };

    return transporter.sendMail(mailOptions);
};