/******************************************************************************
 * Objetivo: Arquivo responsavel pelo CRUD de dados no MySQL referente a receita
 * Data: 24/11/2025
 * Autor: Tiago Guimarães
 * Versão: 1.0
 ******************************************************************************/

/*
    Exemplos de dependencias para conexão com o BD

    Banco de Dados relacionais:

        Sequelize -> foi utilizado em muitos projetos desde o inicio do node

        Prisma    -> é uma dependencia atual que trabalha com BD (MySQL, PostgreSQL, SQL Server) (SQL ou ORM)

                npm install prisma --save           -> instalar o prisma (conexão com o DataBase)
                npm install @prisma/client --save   -> instalar o cliente do prisma (executar scripts SQL no DB)
                npx prisma init                     -> prompt de comando para inicializar o prisma
                npx prisma migrate dev              -> realiza o sincronismo entre o prisma e o DB (CUIDADO,
                                                    nesse processo você poderá perder dados reais do DB, pois
                                                    ele pega e cria as tabelas programadas no ORM schema.prisma)
                npx prisma generate                 -> apenas realiza o sincronismo entre o prisma e o DB, geralmente
                                                    usamos para rodar o projeto em um PC novo

        Knex      -> é uma dependencia atual que trabalha com MySQL

    Banco de Dados não relacional:

        Mongoose  -> é uma dependencia para o Mongo DB (Não relacional)

*/

//import da dependencia do Prisma que permite a execução de script SQL no BD
const { PrismaClient } = require("../../generated/prisma");

//cria um novo objeto baseado na classe do PrismaClient
const prisma = new PrismaClient();

//$queryRawUnsafe() -> permite executar um script SQL de uma variavel e que retorna valores do banco (SELECT)
//$executeRawUnsafe() -> permite executar um script SQL de uma variavel e que NÃO retorna valores do banco (INSERT, UPDATE e DELETE)
//$queryRaw() -> permite executar um script SQL SEM estar em uma variavel e que retorna valores do banco (SELECT) e faz tratamentos de segurança contra SQL Injection
//$executeRaw() -> permite executar um script SQL SEM estar em uma variavel e que NÃO retorna valores do banco (INSERT, UPDATE e DELETE) e faz tratamentos de segurança contra SQL Injection

// Retorna uma lista de todas as receitas do banco de dados
const getSelectAllRecipes = async () => {
  try {
    //script SQL
    let sql = `select * from tb_receitas where id_status = 1 order by id desc`;

    //encaminha para o BD o script SQL
    let result = await prisma.$queryRawUnsafe(sql);
    // console.log(result);

    if (Array.isArray(result)) return result;
    else return false;
  } catch (error) {
    //console.log(error)
    return false;
  }
};

// getSelectAllRecipes();

const getSelectRecipesById = async (id) => {
  try {
    //script SQL
    let sql = `select * from tb_receitas where id=${id}`;
    //encaminha para o BD o script SQL
    let result = await prisma.$queryRawUnsafe(sql);
    // console.log(result);

    if (Array.isArray(result)) return result;
    else return false;
  } catch (error) {
    //console.log(error)
    return false;
  }
};

// getSelectRecipesById(2);

//retorna o último ID gerado no DB. Sera utilizado para aparecer quando uma receita for adicionada
const getSelectLastId = async () => {
  try {
    //script sql para retornar apenas o ultimo ID do DB
    let sql = `select id from tb_receitas order by id desc limit 1;`;
    //encaminha para o DB o script SQL
    let result = await prisma.$queryRawUnsafe(sql);
    // console.log(result);

    if (Array.isArray(result)) return Number(result[0].id);
    else return false;
  } catch (error) {
    return false;
  }
};

// getSelectLastId();

//insere uma receita nova no banco de dados
const setInsertRecipes = async (receita) => {
  try {
    let sql = `INSERT INTO tb_receitas (
                        titulo,
                        descricao,
						            tempo_preparo,
                        passos_preparo,
                        calorias,
                        avaliacao,
                        likes,
                        data_cadastro,
                        id_usuario,
                        id_dificuldade,
                        id_tipo_cozinha,
                        id_status)
					      values( 
                            '${receita.titulo}',
                            '${receita.descricao}',
							              '${receita.tempo_preparo}',
                            '${receita.passos_preparo}',
                            '${receita.calorias}',
                            '${receita.avaliacao}',
                            '${receita.likes}',
                            curdate(),
                            '${receita.id_usuario}',
                            '${receita.id_dificuldade}',
                            '${receita.id_tipo_cozinha}',
                            '${receita.id_status}')`;

    //executeRawUnsafe() -> executa o script SQL que não tem retorno de valores
    let result = await prisma.$executeRawUnsafe(sql);
    console.log(result);

    if (result) return true;
    else return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

// let novaReceita = {
//   titulo: "Bolo de Cenoura",
//   descricao: "",
//   tempo_preparo: "01:00:00",
//   passos_preparo: "Misture tudo e leve ao forno",
//   calorias: 250,
//   avaliacao: 4.5,
//   likes: 150,
//   id_usuario: 1,
//   id_dificuldade: 2,
//   id_tipo_cozinha: 3,
//   id_status: 1,
// };

// setInsertRecipes(novaReceita);

// Altera uma receita pelo ID no banco de dados
const setUpdateRecipes = async (receita) => {
  try {
    let sql = `UPDATE tb_receitas SET
                        titulo = '${receita.titulo}',
                        descricao = '${receita.descricao}',
						            tempo_preparo = '${receita.tempo_preparo}',
                        passos_preparo = '${receita.passos_preparo}',
                        calorias = '${receita.calorias}',
                        avaliacao = '${receita.avaliacao}',
                        likes = '${receita.likes}',
                        id_dificuldade = '${receita.id_dificuldade}',
                        id_tipo_cozinha = '${receita.id_tipo_cozinha}',
                        id_status = '${receita.id_status}'
                        
                    WHERE id = ${receita.id}`;

    //executeRawUnsafe() -> executa o script SQL que não tem retorno de valores
    let result = await prisma.$executeRawUnsafe(sql);
    console.log(result);

    if (result) return true;
    else return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

// let updateReceita = {
//   id: 4,
//   titulo: "Bolo de Cenoura Cremoso",
//   descricao: "Bolo de cenoura com cobertura de chocolate",
//   tempo_preparo: "01:25:00",
//   passos_preparo: "Misture tudo e leve ao forno. Sirva gelado.",
//   calorias: 350,
//   avaliacao: 4.5,
//   likes: 150,
//   data_cadastro: "2025-11-24",
//   id_dificuldade: 2,
//   id_tipo_cozinha: 3,
//   id_status: 1,
// };

// setUpdateRecipes(updateReceita);

// Exclui uma receita pelo ID no banco de dados
const setDeleteRecipes = async (id) => {
  try {
    //Script SQL
    let sql = `UPDATE tb_receitas SET
                    id_status = 2
                        
                    WHERE id = ${id}`;

    //Encaminha para o BD o script SQL
    let result = await prisma.$queryRawUnsafe(sql);

    //console.log(Array.isArray(result))
    if (Array.isArray(result)) return result;
    else return false;
  } catch (error) {
    //console.log(error)
    return false;
  }
};

// setDeleteRecipes(4);

module.exports = {
  getSelectAllRecipes,
  getSelectRecipesById,
  getSelectLastId,
  setInsertRecipes,
  setUpdateRecipes,
  setDeleteRecipes,
};
