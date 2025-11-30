/* *********************************************************************
 * Objetivo: Arquivo responsavel pela manipulação de dados entre o APP e a MODEL para o CRUD de categorias
 *
 * Autor: Thiago Guimarães
 *
 * Data: 25/11/2025
 * Versão: 1.0 (CRUD básico de categorias, sem as relações com outras tabelas)
 * **********************************************************************/

//import da model do DAO do categorias
const categoriaDAO = require("../../model/DAO/categorias.js");

//import do arquivo de mensagens
const DEFAULT_MESSAGES = require("../messages/config_messages.js");

// Retorna uma lista de todas categorias do banco de dados
const listarCategorias = async () => {
  //criando um objeto novo para as mensagens
  let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

  try {
    //chama a função do DAO para retornar a lista de categorias do DB
    let resultCategorias = await categoriaDAO.getSelectAllCategories();

    if (resultCategorias) {
      if (resultCategorias.length > 0) {
        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status;
        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code;
        MESSAGES.DEFAULT_HEADER.items.categorias = resultCategorias;

        return MESSAGES.DEFAULT_HEADER; //200
      } else {
        return MESSAGES.ERROR_NOT_FOUND; //404
      }
    } else {
      return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; //500
    }
  } catch (error) {
    return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER; //500
  }
};

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

          return MESSAGES.DEFAULT_HEADER;
        } else {
          return MESSAGES.ERROR_NOT_FOUND; //404
        }
      } else {
        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; //500
      }
    } else {
      MESSAGES.ERROR_REQUIRED_FIELDS.message += "[ID incorreto]";

      return MESSAGES.ERROR_REQUIRED_FIELDS; //400
    }
  } catch (error) {
    return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER; //500
  }
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
          //adiciona o ID no JSON com os dados da categoria
          categoria.id = lastID;
          MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_CREATED_ITEM.status;
          MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code;
          MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_CREATED_ITEM.message;

          MESSAGES.DEFAULT_HEADER.items = categoria;

          return MESSAGES.DEFAULT_HEADER; //201
        } else {
          return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; //500
        }
      } else {
        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; //500
      }
    } else {
      return MESSAGES.ERROR_CONTENT_TYPE; //415
    }
  } catch (error) {
    return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER; //500
  }
};

//atualiza uma categoria buscando pelo id
const atualizarCategoria = async (categoria, id, contentType) => {
  //criando um objeto novo para as mensagens
  let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

  try {
    //validação do tipo de conteudo da requisição (obrigatorio ser um json)
    if (String(contentType).toUpperCase() == "APPLICATION/JSON") {
      //validação de ID válido, chama a função da controller que verifica no DB se o ID existe e valida o ID
      let validarID = await buscarCategoriaId(id);

      if (validarID.status_code == 200) {
        //chama a função para inserir uma nova categoria no DB
        let resultCategorias = await categoriaDAO.setUpdateCategory(categoria, id);

        if (resultCategorias) {
          MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_UPDATED_ITEM.status;
          MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_UPDATED_ITEM.status_code;
          MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_UPDATED_ITEM.message;
          MESSAGES.DEFAULT_HEADER.categoria = categoria;

          delete MESSAGES.DEFAULT_HEADER.items;

          return MESSAGES.DEFAULT_HEADER; //200
        } else {
          return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; //500
        }
      } else {
        validarID; //Poderá retornar -> 400, 404 ou 500
      }
    } else {
      return MESSAGES.ERROR_CONTENT_TYPE; //415
    }
  } catch (error) {
    return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER; //500
  }
};

//exclui uma categoria buscando pelo id
const excluirCategoria = async (id) => {
  //Criando um objeto novo para as mensagens
  let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

  try {
    //Validação da chegada do ID
    if (!isNaN(id) && id != "" && id != null && id > 0) {
      //Validação de ID válido, chama a função da controller que verifica no BD se o ID existe e valida o ID
      let validarID = await buscarCategoriaId(id);

      if (validarID.status_code == 200) {
        let resultCategorias = await categoriaDAO.setDeleteCategory(Number(id));

        if (resultCategorias) {
          MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_DELETED_ITEM.status;
          MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_DELETED_ITEM.status_code;
          MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_DELETED_ITEM.message;
          MESSAGES.DEFAULT_HEADER.items.categoria = resultCategorias;
          delete MESSAGES.DEFAULT_HEADER.items;
          return MESSAGES.DEFAULT_HEADER; //200
        } else {
          return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; //500
        }
      } else {
        return MESSAGES.ERROR_NOT_FOUND; //404
      }
    } else {
      MESSAGES.ERROR_REQUIRED_FIELDS.message += " [ID incorreto]";
      return MESSAGES.ERROR_REQUIRED_FIELDS; //400
    }
  } catch (error) {
    return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER; //500
  }
};

module.exports = {
  listarCategorias,
  buscarCategoriaId,
  inserirCategoria,
  atualizarCategoria,
  excluirCategoria,
};
