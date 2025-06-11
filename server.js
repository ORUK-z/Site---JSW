// server.js (Versão com Sessões)

import express from 'express';
import bcrypt from 'bcryptjs';
import session from 'express-session'; // <-- 1. Importe o express-session
import { inserirUsuario, validarLogin } from './src/db.js';
import path from 'path';
import { fileURLToPath } from 'url';



const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// --- 2. Configure o Middleware de Sessão ---
app.use(session({
  secret: 'seu_segredo_super_secreto_aqui', // Troque por uma string aleatória e segura
  resave: false,
  saveUninitialized: true, // Idealmente false, mas true é mais simples para começar
  cookie: { secure: false } // Em produção, use true com HTTPS
}));

// --- 3. Modifique a rota /login para CRIAR a sessão ---
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const usuario = await validarLogin(email, senha);
    if (usuario) {
      // Login bem-sucedido! Armazena os dados do usuário na sessão.
      req.session.user = {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      };
      console.log('Sessão criada para:', req.session.user);
      res.redirect('/index.html');
    } else {
      res.redirect('/login.html?erro=credenciais');
    }
  } catch (error) {
    console.error("Erro no servidor durante o login:", error);
    res.status(500).send("Ocorreu um erro inesperado no servidor.");
  }
});

// --- 4. Crie uma rota para o front-end VERIFICAR a sessão ---
app.get('/api/user', (req, res) => {
  if (req.session.user) {
    // Se existe um usuário na sessão, envia seus dados
    res.json(req.session.user);
  } else {
    // Se não, envia nulo
    res.json(null);
  }
});

// --- 5. Crie uma rota para DESTRUIR a sessão (Logout) ---
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Não foi possível fazer logout.');
    }
    // Limpa o cookie no navegador e redireciona
    res.clearCookie('connect.sid'); // 'connect.sid' é o nome padrão do cookie de sessão
    res.redirect('/index.html');
  });
});

// --- Rotas existentes (register, etc.) ---
app.post('/register', async (req, res) => {
  // (seu código da rota de registro... sem alterações aqui)
  const { name, email, senha } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);
    await inserirUsuario({ nome: name, email: email, senha: senhaHash });
    res.redirect('/login.html');
  } catch (error) {
    if (error.message === 'Email já cadastrado') {
      res.redirect('/register.html?erro=email');
    } else {
      res.status(500).send('Ocorreu um erro inesperado no servidor.');
    }
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Google Authentication Routes
app.get('/auth/google', (req, res) => {
    res.redirect(generateAuthUrl());
});

app.get('/auth/google/callback', async (req, res) => {
    try {
        const { code } = req.query;
        if (!code) throw new Error('No code provided');

        // Exchange authorization code for tokens
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // Verify Google token
        const { email, name, picture } = await verifyGoogleToken(tokens.id_token);

        // Check if user exists in database
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            // User exists, log them in
            req.session.user = {
                id: existingUser.id,
                nome: existingUser.nome,
                email: existingUser.email
            };
            res.redirect('/index.html');
        } else {
            // User doesn't exist, create new user
            const newUser = await prisma.user.create({
                data: {
                    nome: name,
                    email: email,
                    senha: null, // Google users don't have passwords
                    foto: picture
                }
            });

            req.session.user = {
                id: newUser.id,
                nome: newUser.nome,
                email: newUser.email
            };
            res.redirect('/index.html');
        }
    } catch (error) {
        console.error('Google auth error:', error);
        res.redirect('/login.html?error=google_auth_failed');
    }
});

// --- Nova rota para criar agendamento ---
app.post('/api/appointments', async (req, res) => {
  try {
    const { name, address, serviceType, date } = req.body;
    const user = req.session.user;

    if (!user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const appointment = await prisma.appointment.create({
      data: {
        userId: user.id,
        name,
        address,
        serviceType,
        date: new Date(date),
        status: 'AGUARDANDO'
      }
    });

    res.json(appointment);
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({ error: 'Erro ao criar agendamento' });
  }
});

// --- Nova rota para listar histórico de agendamentos ---
app.get('/api/appointments/history', async (req, res) => {
  try {
    const user = req.session.user;

    if (!user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        date: 'desc'
      },
      include: {
        user: {
          select: {
            nome: true,
            email: true
          }
        }
      }
    });

    res.json(appointments);
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({ error: 'Erro ao buscar histórico de agendamentos' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor completo rodando na porta ${PORT}`);
  console.log(`Acesse seu site em http://localhost:${PORT}`);
});