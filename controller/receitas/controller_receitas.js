/* *********************************************************************
 * Objetivo: Arquivo responsavel pela manipulação de dados entre o APP e a MODEL para o CRUD de receitas
 *
 * Autor: Tiago Guimarães
 *
 * Data: 25/11/2025
 * Versão: 1.0 (CRUD básico de receitas, sem as relações com outras tabelas)
 * **********************************************************************/

// import da model do DAO das receitas
const receitaDAO = require("../../model/DAO/receita.js");

//import do arquivo de mensagens
const DEFAULT_MESSAGES = require("../messages/config_messages.js");

// Retorna uma lista de todos as receitas do banco de dados
const listarReceitas = async () => {
  //criando um objeto novo para as mensagens
  let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

  try {
    //chama a função do DAO para retornar a lista de receitas do DB
    let resultReceitas = await receitaDAO.getSelectAllRecipes();

    if (resultReceitas) {
      if (resultReceitas.length > 0) {
        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status;
        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code;
        MESSAGES.DEFAULT_HEADER.items.receitas = resultReceitas;

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

// retorna uma receita filtrando pelo ID
const buscarReceitaId = async (id) => {
  //criando um objeto novo para as mensagens
  let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

  try {
    //validação da chegada do ID
    if (!isNaN(id) && id != "" && id != null && id > 0) {
      let resultReceitas = await receitaDAO.getSelectRecipesById(Number(id));

      if (resultReceitas) {
        if (resultReceitas.length > 0) {
          MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status;
          MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code;
          MESSAGES.DEFAULT_HEADER.items.receitas = resultReceitas;

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

//insere uma receita
/* Vazio, undefined e null estão sendo cadastrados no banco. Tratar pelo front */
const inserirReceita = async (receita, contentType) => {
  //criando um objeto novo para as mensagens
  let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

  try {
    //validação do tipo de conteudo da requisição (obrigatorio ser um json)
    if (String(contentType).toUpperCase() == "APPLICATION/JSON") {
      //chama a função para inserir uma nova receita no DB
      let resultReceitas = await receitaDAO.setInsertRecipes(receita);

      if (resultReceitas) {
        //chama a função para receber o ID gerado no DB
        let lastID = await receitaDAO.getSelectLastId();

        if (lastID) {
          //adiciona o ID no JSON com os dados da receita
          receita.id = lastID;
          MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_CREATED_ITEM.status;
          MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code;
          MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_CREATED_ITEM.message;

          // MESSAGES.DEFAULT_HEADER.items = usuario;
          // criar variável para receber os dados parciais da receita

          let getReceita = await buscarReceitaId(receita.id);

          let receitaData = {
            id: getReceita.items.receitas[0].id,
            titulo: getReceita.items.receitas[0].titulo,
            descricao: getReceita.items.receitas[0].descricao,
            tempo_preparo: getReceita.items.receitas[0].tempo_preparo,
            passos_preparo: getReceita.items.receitas[0].passos_preparo,
            calorias: getReceita.items.receitas[0].calorias,
            avaliacao: getReceita.items.receitas[0].avaliacao,
            likes: getReceita.items.receitas[0].likes,
            url_imagem: getReceita.items.receitas[0].url_imagem,
            data_cadastro: getReceita.items.receitas[0].data_cadastro,
          };

          delete MESSAGES.DEFAULT_HEADER.items;
          MESSAGES.DEFAULT_HEADER.receita = receitaData;
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

//atualiza uma receita buscando pelo id

const atualizarReceita = async (receita, id, contentType) => {
  //criando um objeto novo para as mensagens
  let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

  try {
    //validação do tipo de conteudo da requisição (obrigatorio ser um json)
    if (String(contentType).toUpperCase() == "APPLICATION/JSON") {
      //validação de ID válido, chama a função da controller que verifica no DB se o ID existe e valida o ID
      let validarID = await buscarReceitaId(id);

      if (validarID.status_code == 200) {
        //chama a função para inserir uma nova receita no DB
        let resultReceitas = await receitaDAO.setUpdateRecipes(receita, id);
        if (resultReceitas) {
          MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_UPDATED_ITEM.status;
          MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_UPDATED_ITEM.status_code;
          MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_UPDATED_ITEM.message;
          MESSAGES.DEFAULT_HEADER.items.usuario = usuario;
          return MESSAGES.DEFAULT_HEADER; //200
        } else {
          return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; //500
        }
      } else {
        return validarID; //Poderá retornar -> 400, 404 ou 500
      }
    } else {
      return MESSAGES.ERROR_CONTENT_TYPE; //415
    }
  } catch (error) {
    return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER; //500
  }
};

//exclui uma receita buscando pelo id
const excluirReceita = async (id) => {
  //Criando um objeto novo para as mensagens
  let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

  try {
    //Validação da chegada do ID
    if (!isNaN(id) && id != "" && id != null && id > 0) {
      //Validação de ID válido, chama a função da controller que verifica no BD se o ID existe e valida o ID
      let validarID = await buscarReceitaId(id);

      if (validarID.status_code == 200) {
        let resultReceitas = await receitaDAO.setDeleteRecipes(Number(id));

        if (resultReceitas) {
          MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_DELETED_ITEM.status;
          MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_DELETED_ITEM.status_code;
          MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_DELETED_ITEM.message;
          MESSAGES.DEFAULT_HEADER.items.receita = resultReceitas;
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
  listarReceitas,
  buscarReceitaId,
  inserirReceita,
  atualizarReceita,
  excluirReceita,
};
