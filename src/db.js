import { PrismaClient } from "../generated/prisma/index.js";
const prisma = new PrismaClient()

async function getUser() {
    const usuario = await prisma.usuario.findMany()
    console.log(usuario)
}

getUser()