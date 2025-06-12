import { PrismaClient } from "../generated/prisma/index.js";
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient()

async function init_server() {
    console.log("server.js inicializado...")
}

init_server()

/**
 * Insere um novo usuário na tabela 'usuario'.
 * @param {object} dadosUsuario - O objeto contendo os dados do usuário.
 * @returns {Promise<object>} Retorna o objeto do usuário criado ou lança um erro.
 */
async function inserirUsuario(dadosUsuario) {
  try {
    const novoUsuario = await prisma.usuario.create({
      data: {
        nome: dadosUsuario.nome,
        email: dadosUsuario.email,
        senha: dadosUsuario.senha,
      },
    });
    console.log('Usuário criado com sucesso:', novoUsuario);
    return novoUsuario;

  } catch (error) {
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      throw new Error('Email já cadastrado');
    }
    console.error('Erro ao inserir usuário no banco de dados:', error);
    throw error;

  } finally {
    await prisma.$disconnect();
  }
}


/**
 * Valida as credenciais de login de um usuário.
 * @param {string} email - O email fornecido pelo usuário.
 * @param {string} senhaPura - A senha em texto plano fornecida pelo usuário.
 * @returns {Promise<object|null>} Retorna o objeto do usuário se a validação for bem-sucedida, caso contrário, retorna null.
 */
async function validarLogin(email, senhaPura) {
  try {
    // 1. Encontrar o usuário pelo email, que é um campo único.
    const usuario = await prisma.usuario.findUnique({
      where: {
        email: email,
      },
    });

    // 2. Se o usuário não for encontrado, o login falha.
    if (!usuario) {
      return null;
    }

    // 3. Compara a senha pura fornecida com a senha hasheada no banco de dados.
    // O bcrypt.compare faz isso de forma segura, sem expor os hashes.
    const senhaCorreta = await bcrypt.compare(senhaPura, usuario.senha);

    if (senhaCorreta) {
      // 4. Se a senha estiver correta, retorna o objeto do usuário.
      return usuario;
    } else {
      // 5. Se a senha estiver incorreta, o login falha.
      return null;
    }
  } catch (error) {
    console.error("Erro ao validar login:", error);
    // Lança o erro para que a rota possa tratá-lo como um erro de servidor.
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}


// Exporta ambas as funções
export {
  inserirUsuario,
  validarLogin,
};