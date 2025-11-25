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

// listarUsuarios();

//retorna um usuario filtrando pelo ID
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

// buscarUsuarioId(3);

const novoUsuario = {
  nome: "Rebeca",
  genero: "Feminino",
  email: "rebeca@email.com",
  senha: "senha456",
  administrador: 1,
  contentType: "application/json",
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

          MESSAGES.DEFAULT_HEADER.items = usuario;
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

inserirUsuario(novoUsuario, novoUsuario.contentType);

module.exports = {
  listarUsuarios,
  buscarUsuarioId,
  inserirUsuario,
};
