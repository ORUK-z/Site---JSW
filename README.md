Com certeza. Com base em tudo que construímos, preparei um arquivo `README.md` completo e profissional para o back-end do seu projeto no GitHub.

Este `README` explica o propósito do projeto, as tecnologias utilizadas, e fornece um guia passo a passo para que qualquer outro desenvolvedor (ou você mesmo no futuro) possa configurar e rodar o ambiente de desenvolvimento facilmente.

-----

# Backend - TecEmCasa

Este repositório contém o código-fonte do servidor back-end para a plataforma **TecEmCasa**. A aplicação foi construída com Node.js e Express, utilizando o Prisma como ORM para se comunicar com um banco de dados PostgreSQL.

O objetivo principal deste back-end é gerenciar a lógica de negócios, autenticação de usuários e servir os dados necessários para a interface front-end.

## ✨ Funcionalidades

  - **Servidor de API RESTful**: Construído com Express.js para lidar com requisições HTTP.
  - **Cadastro de Usuários**: Rota para registro de novos usuários com criptografia de senha segura utilizando `bcryptjs`.
  - **Autenticação de Usuários**: Rota de login que valida as credenciais e cria uma sessão de usuário.
  - **Gerenciamento de Sessão**: Utiliza `express-session` para manter o estado de login do usuário entre as requisições.
  - **Endpoints Protegidos**: Rotas de API que fornecem dados do usuário logado e permitem o logout.
  - **Integração com Banco de Dados**: Utiliza o ORM Prisma para interagir de forma segura e tipada com o banco de dados PostgreSQL.
  - **Servir Arquivos Estáticos**: O servidor Express também é responsável por servir os arquivos do front-end (HTML, CSS, JS) que estão na pasta `public`.

## 🛠️ Tecnologias Utilizadas

  - **Node.js**: Ambiente de execução JavaScript do lado do servidor.
  - **Express.js**: Framework para construção de APIs e gerenciamento de rotas.
  - **PostgreSQL**: Banco de dados relacional.
  - **Prisma**: ORM (Object-Relational Mapper) de próxima geração para Node.js e TypeScript.
  - **`express-session`**: Middleware para gerenciamento de sessões.
  - **`bcryptjs`**: Biblioteca para hashing de senhas.
  - **ES Modules**: Utiliza a sintaxe `import`/`export` do JavaScript moderno.

## 🚀 Instalação e Configuração

Siga os passos abaixo para configurar e rodar o projeto em um ambiente de desenvolvimento local.

### Pré-requisitos

  - [Node.js](https://nodejs.org/) (versão 18.x ou superior)
  - [npm](https://www.npmjs.com/) (geralmente instalado com o Node.js)
  - Uma instância do [PostgreSQL](https://www.postgresql.org/download/) rodando localmente ou em um container Docker.

### Guia de Instalação

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/seu-usuario/tecemcasa-backend.git
    cd tecemcasa-backend
    ```

2.  **Instale as dependências do projeto:**

    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo chamado `.env` na raiz do projeto, copiando o exemplo de `.env.example` (se houver) ou usando o modelo abaixo. Este arquivo guardará a string de conexão do seu banco de dados.

    ```ini
    # .env
    DATABASE_URL="postgresql://SEU_USUARIO:SUA_SENHA@localhost:5432/NOME_DO_BANCO"
    ```

      - Substitua `SEU_USUARIO`, `SUA_SENHA` e `NOME_DO_BANCO` pelas suas credenciais do PostgreSQL.

4.  **Execute as Migrações do Banco de Dados:**
    Este comando irá ler seu arquivo `prisma/schema.prisma` e criar todas as tabelas necessárias no banco de dados.

    ```bash
    npx prisma migrate dev
    ```

## ▶️ Rodando a Aplicação

Após a instalação e configuração, inicie o servidor com o seguinte comando:

```bash
node server.js
```

O servidor estará rodando e acessível em `http://localhost:3000`. Você verá uma mensagem de confirmação no terminal.

## API Endpoints

O servidor expõe os seguintes endpoints principais:

| Método | Rota         | Descrição                                                                      |
| :----- | :----------- | :----------------------------------------------------------------------------- |
| `POST` | `/register`  | Registra um novo usuário. Espera `name`, `email` e `senha` no corpo.           |
| `POST` | `/login`     | Autentica um usuário. Espera `email` e `senha`. Cria uma sessão se for bem-sucedido. |
| `GET`  | `/logout`    | Destrói a sessão do usuário atual e o desloga.                                 |
| `GET`  | `/api/user`  | Retorna os dados do usuário logado (nome, email, id) ou `null` se não houver sessão. |

## 📁 Estrutura do Projeto

```
.
├── prisma/
│   ├── migrations/
│   └── schema.prisma    # Definição dos modelos do banco de dados
├── public/              # Arquivos de front-end
│   ├── js/
│   └── *.html
├── src/
│   └── db.js            # Funções de interação com o banco de dados (Prisma)
├── .env                 # Variáveis de ambiente (NÃO ENVIAR PARA O GIT)
├── .gitignore
├── package.json
└── server.js            # Arquivo principal do servidor Express
```

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.
