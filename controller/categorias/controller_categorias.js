/* *********************************************************************
 * Objetivo: Arquivo responsavel pela manipulação de dados entre o APP e a MODEL para o CRUD de categorias
 *
 * Autor: Tiago Guimarães
 *
 * Data: 25/11/2025
 * Versão: 1.0 (CRUD básico de categorias, sem as relações com outras tabelas)
 * **********************************************************************/

//import da model do DAO do categorias
const categoriaDAO = require("../../model/DAO/categorias.js");

//import do arquivo de mensagens
const DEFAULT_MESSAGES = require("../messages/config_messages.js");

// Retorna uma lista de todos os usuários do banco de dados
const listarCategorias = async () => {
  //criando um objeto novo para as mensagens
  let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

  try {
    //chama a função do DAO para retornar a lista de usuários do DB
    let resultCategorias = await categoriaDAO.getSelectAllCategories();

    if (resultCategorias) {
      if (resultCategorias.length > 0) {
        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status;
        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code;
        MESSAGES.DEFAULT_HEADER.items.categorias = resultCategorias;
        console.log(MESSAGES.DEFAULT_HEADER);
        return MESSAGES.DEFAULT_HEADER; //200
      } else {
        console.log(MESSAGES.ERROR_NOT_FOUND);
        return MESSAGES.ERROR_NOT_FOUND; //404
      }
    } else {
      console.log(MESSAGES.ERROR_INTERNAL_SERVER_MODEL);
      return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; //500
    }
  } catch (error) {
    console.log(MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER);
    return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER; //500
  }
};

// listarCategorias();

// Retorna uma categoria filtrando pelo ID
const buscarCategoriaId = async (id) => {
  //criando um objeto novo para as mensagens
  let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

  try {
    //validação da chegada do ID
    if (!isNaN(id) && id != "" && id != null && id > 0) {
      let resultCategorias = await categoriaDAO.getSelectCategoryById(Number(id));

      if (resultCategorias) {
        if (resultCategorias.length > 0) {
          MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status;
          MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code;
          MESSAGES.DEFAULT_HEADER.items.categorias = resultCategorias;

          console.log(MESSAGES.DEFAULT_HEADER);
          return MESSAGES.DEFAULT_HEADER;
        } else {
          console.log(MESSAGES.ERROR_NOT_FOUND);
          return MESSAGES.ERROR_NOT_FOUND; //404
        }
      } else {
        console.log(MESSAGES.ERROR_INTERNAL_SERVER_MODEL);
        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; //500
      }
    } else {
      MESSAGES.ERROR_REQUIRED_FIELDS.message += "[ID incorreto]";
      console.log(MESSAGES.ERROR_REQUIRED_FIELDS);
      return MESSAGES.ERROR_REQUIRED_FIELDS; //400
    }
  } catch (error) {
    console.log(MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER);
    return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER; //500
  }
};

// buscarCategoriaId(3);

const novaCategoria = {
  nome: "Infantil",
  contentType: "application/json",
};

//insere uma categoria
/* Vazio, undefined e null estão sendo cadastrados no banco. Tratar pelo front */
const inserirCategoria = async (categoria, contentType) => {
  //criando um objeto novo para as mensagens
  let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

  try {
    //validação do tipo de conteudo da requisição (obrigatorio ser um json)
    if (String(contentType).toUpperCase() == "APPLICATION/JSON") {
      //chama a função para inserir uma nova categoria no DB
      let resultCategorias = await categoriaDAO.setInsertCategory(categoria);

      if (resultCategorias) {
        //chama a função para receber o ID gerado no DB
        let lastID = await categoriaDAO.getSelectLastId();

        if (lastID) {
          //adiciona o ID no JSON com os dados do usuário
          categoria.id = lastID;
          MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_CREATED_ITEM.status;
          MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code;
          MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_CREATED_ITEM.message;

          MESSAGES.DEFAULT_HEADER.items = categoria;
          console.log(MESSAGES.DEFAULT_HEADER);

          return MESSAGES.DEFAULT_HEADER; //201
        } else {
          console.log(MESSAGES.ERROR_INTERNAL_SERVER_MODEL);
          return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; //500
        }
      } else {
        console.log(MESSAGES.ERROR_INTERNAL_SERVER_MODEL);
        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; //500
      }
    } else {
      console.log(MESSAGES.ERROR_CONTENT_TYPE);
      return MESSAGES.ERROR_CONTENT_TYPE; //415
    }
  } catch (error) {
    console.log(MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER);
    return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER; //500
  }
};

inserirCategoria(novaCategoria, novaCategoria.contentType);

module.exports = {
  listarCategorias,
  buscarCategoriaId,
  inserirCategoria,
};
