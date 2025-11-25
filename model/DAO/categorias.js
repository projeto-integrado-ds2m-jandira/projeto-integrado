/******************************************************************************
 * Objetivo: Arquivo responsavel pelo CRUD de dados no MySQL referente as categorias
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

// Retorna uma lista de todas as categorias do banco de dados
const getSelectAllCategories = async () => {
  try {
    //script SQL
    let sql = `select * from tb_categorias where id_status = 1 order by id desc`;

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

// getSelectAllCategories();

// Retorna uma categoria pelo ID do banco de dados
const getSelectCategoryById = async (id) => {
  try {
    //script SQL
    let sql = `select * from tb_categorias where id=${id}`;
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

// getSelectCategoryById(2);

// Retorna o último ID gerado no DB. Sera utilizado para aparecer quando um usuario for adicionado
const getSelectLastId = async () => {
  try {
    //script sql para retornar apenas o ultimo ID do DB
    let sql = `select id from tb_categorias order by id desc limit 1;`;
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

//insere uma nova categoria no banco de dados.
const setInsertCategory = async (categoria) => {
  try {
    let sql = `INSERT INTO tb_categorias (
                        nome)
					      values( 
                        '${categoria.nome}')`;

    //executeRawUnsafe() -> executa o script SQL que não tem retorno de valores
    let result = await prisma.$executeRawUnsafe(sql);
    // console.log(result);

    if (result) return true;
    else return false;
  } catch (error) {
    // console.log(error);
    return false;
  }
};

// let newCategory = {
//   nome: "Salgado",
// };

// setInsertCategory(newCategory);

// Altera uma categoria pelo ID no banco de dados
const setUpdateCategory = async (categoria) => {
  try {
    let sql = `UPDATE tb_categorias SET
                        nome = '${categoria.nome}'
                                               
                    WHERE id = ${categoria.id}`;

    //executeRawUnsafe() -> executa o script SQL que não tem retorno de valores
    let result = await prisma.$executeRawUnsafe(sql);
    // console.log(result);

    if (result) return true;
    else return false;
  } catch (error) {
    // console.log(error);
    return false;
  }
};

// let updateCategoria = {
//   id: 5,
//   nome: "Salgados",
// };

// setUpdateCategory(updateCategoria);

// Exclui uma categoria pelo ID no banco de dados
const setDeleteCategory = async (id) => {
  try {
    //Script SQL
    let sql = `UPDATE tb_categorias SET
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

// setDeleteCategory(5);

module.exports = {
  getSelectAllCategories,
  getSelectLastId,
  getSelectCategoryById,
  setInsertCategory,
  setUpdateCategory,
  setDeleteCategory,
};
