/* *********************************************************************
 * Objetivo: Arquivo responsavel pela manipulação de dados entre o APP e a MODEL para o CRUD de usuários
 *
 * Autor: Tiago Guimarães
 *
 * Data: 25/11/2025
 * Versão: 1.0 (CRUD básico de usuário, sem as relações com outras tabelas)
 * **********************************************************************/

//import da model do DAO do usuário
const usuarioDAO = require("../../model/DAO/usuario.js");

//import do arquivo de mensagens
const DEFAULT_MESSAGES = require("../messages/config_messages.js");

// Retorna uma lista de todos os usuários do banco de dados
const listarUsuarios = async () => {
  //criando um objeto novo para as mensagens
  let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

  try {
    //chama a função do DAO para retornar a lista de usuários do DB
    let resultUsuarios = await usuarioDAO.getSelectAllUsers();

    if (resultUsuarios) {
      if (resultUsuarios.length > 0) {
        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status;
        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code;
        MESSAGES.DEFAULT_HEADER.items.usuarios = resultUsuarios;

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

// retorna um usuario filtrando pelo ID
const buscarUsuarioId = async (id) => {
  //criando um objeto novo para as mensagens
  let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

  try {
    //validação da chegada do ID
    if (!isNaN(id) && id != "" && id != null && id > 0) {
      let resultUsuarios = await usuarioDAO.getSelectUserById(Number(id));

      if (resultUsuarios) {
        if (resultUsuarios.length > 0) {
          MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status;
          MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code;
          MESSAGES.DEFAULT_HEADER.items.usuarios = resultUsuarios;

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

//insere um usuário
/* Vazio, undefined e null estão sendo cadastrados no banco. Tratar pelo front */
const inserirUsuario = async (usuario, contentType) => {
  //criando um objeto novo para as mensagens
  let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

  try {
    //validação do tipo de conteudo da requisição (obrigatorio ser um json)
    if (String(contentType).toUpperCase() == "APPLICATION/JSON") {
      //chama a função para inserir um novo usuario no DB
      let resultUsuarios = await usuarioDAO.setInsertUser(usuario);

      if (resultUsuarios) {
        //chama a função para receber o ID gerado no DB
        let lastID = await usuarioDAO.getSelectLastId();

        if (lastID) {
          //adiciona o ID no JSON com os dados do usuário
          usuario.id = lastID;
          MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_CREATED_ITEM.status;
          MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code;
          MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_CREATED_ITEM.message;

          // MESSAGES.DEFAULT_HEADER.items = usuario;
          // criar variável para receber os dados parciais do usuário

          let getUser = await buscarUsuarioId(usuario.id);

          let userData = {
            id: getUser.items.usuarios[0].id,
            nome: getUser.items.usuarios[0].nome,
            genero: getUser.items.usuarios[0].genero,
            email: getUser.items.usuarios[0].email,
            senha: getUser.items.usuarios[0].senha,
            url_imagem: getUser.items.usuarios[0].url_imagem,
            administrador: getUser.items.usuarios[0].administrador,
            id_status: getUser.items.usuarios[0].id_status,
            data_criacao: getUser.items.usuarios[0].data_criacao,
          };

          delete MESSAGES.DEFAULT_HEADER.items;
          MESSAGES.DEFAULT_HEADER.usuario = userData;
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

//atualiza um usuario buscando pelo id

const atualizarUsuario = async (usuario, id, contentType) => {
  //criando um objeto novo para as mensagens
  let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

  try {
    //validação do tipo de conteudo da requisição (obrigatorio ser um json)
    if (String(contentType).toUpperCase() == "APPLICATION/JSON") {
      //validação de ID válido, chama a função da controller que verifica no DB se o ID existe e valida o ID
      let validarID = await buscarUsuarioId(id);

      if (validarID.status_code == 200) {
        //chama a função para inserir um novo usuario no DB
        let resultUsuarios = await usuarioDAO.setUpdateUser(usuario, id);

        if (resultUsuarios) {
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

//exclui um usuario buscando pelo id
const excluirUsuario = async (id) => {
  //Criando um objeto novo para as mensagens
  let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

  try {
    //Validação da chegada do ID
    if (!isNaN(id) && id != "" && id != null && id > 0) {
      //Validação de ID válido, chama a função da controller que verifica no BD se o ID existe e valida o ID
      let validarID = await buscarUsuarioId(id);

      if (validarID.status_code == 200) {
        let resultUsuarios = await usuarioDAO.setDeleteUser(Number(id));

        if (resultUsuarios) {
          MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_DELETED_ITEM.status;
          MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_DELETED_ITEM.status_code;
          MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_DELETED_ITEM.message;
          MESSAGES.DEFAULT_HEADER.items.usuario = resultUsuarios;
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
  listarUsuarios,
  buscarUsuarioId,
  inserirUsuario,
  atualizarUsuario,
  excluirUsuario,
};
