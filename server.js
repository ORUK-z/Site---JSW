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

app.listen(PORT, () => {
  console.log(`Servidor completo rodando na porta ${PORT}`);
  console.log(`Acesse seu site em http://localhost:${PORT}`);
});