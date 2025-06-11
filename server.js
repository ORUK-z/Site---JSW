const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const USERS_FILE = './users.json';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.post('/register', (req, res) => {
  const { name, email, senha } = req.body;
  const usuarios = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));

  const existente = usuarios.find(user => user.email === email);
  if (existente) {
    return res.redirect('/register.html');
  }

  usuarios.push({ name, email, senha });
  fs.writeFileSync(USERS_FILE, JSON.stringify(usuarios, null, 2));
  res.redirect('/index.html');
});

app.post('/login', (req, res) => {
  const { email, senha } = req.body;
  const usuarios = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));

  const user = usuarios.find(u => u.email === email && u.senha === senha);
  if (user) {
    res.redirect('/index.html'); 
  } else {
    res.redirect('/login.html'); 
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
// Cadastro
app.post('/register', (req, res) => {
  const { name, email, senha } = req.body;
  const usuarios = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));

  const existente = usuarios.find(user => user.email === email);
  if (existente) {
    return res.redirect('/register.html?erro=email');
  }

  usuarios.push({ name, email, senha });
  fs.writeFileSync(USERS_FILE, JSON.stringify(usuarios, null, 2));
  res.redirect('/index.html?mensagem=registro_sucesso');
});

// Login
app.post('/login', (req, res) => {
  const { email, senha } = req.body;
  const usuarios = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));

  const user = usuarios.find(u => u.email === email && u.senha === senha);
  if (user) {
    res.redirect('/index.html?mensagem=login_sucesso');
  } else {
    res.redirect('/login.html?erro=credenciais');
  }
});
