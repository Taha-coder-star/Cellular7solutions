const nodemailer = require('nodemailer');

let transporter;
function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
}

const EMAIL_RE = /^\S+@\S+\.\S+$/;

const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !name.trim() || name.length > 100) {
      return res.status(400).json({ message: 'Name is required and must be under 100 characters' });
    }
    if (!email || !EMAIL_RE.test(email)) {
      return res.status(400).json({ message: 'A valid email is required' });
    }
    if (!message || !message.trim() || message.length > 2000) {
      return res.status(400).json({ message: 'Message is required and must be under 2000 characters' });
    }

    await getTransporter().sendMail({
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `New contact form message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    res.status(200).json({ message: 'Message sent' });
  } catch (err) {
    console.error('sendContactMessage:', err);
    res.status(500).json({ message: 'Failed to send message. Please try again later.' });
  }
};

module.exports = { sendContactMessage };
