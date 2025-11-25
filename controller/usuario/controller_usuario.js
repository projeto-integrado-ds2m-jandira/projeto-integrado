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

module.exports = {
  listarUsuarios,
};
