/* *********************************************************************
 * Objetivo: Arquivo responsavel pela manipulação de dados entre o APP e a MODEL para o CRUD de ingredientes
 *
 * Autor: Maria Cecilia
 *
 * Data: 27/11/2025
 * Versão: 1.0
 * **********************************************************************/

const ingredientesDAO = require("../../model/DAO/ingredientes.js");

const DEFAULT_MESSAGES = require("../messages/config_messages.js");

//lista de todas os ingredientes do banco de dados
const listarIngredientes = async function () {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

    try {
        //chama a função do DAO para retornar a lista de ingredientes do DB
        let resultIngredientes = await ingredientesDAO.getSelectAllIngredients();

        if (resultIngredientes) {
            if (resultIngredientes.length > 0) {
                MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status;
                MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code;
                MESSAGES.DEFAULT_HEADER.ingredientes = resultIngredientes;

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

const buscarIngredientesId = async function (id) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

    try {
        if (!isNaN(id) && id != "" && id != null && id > 0) {
            let resultIngredientes = await ingredientesDAO.getSelectIngredientById(Number(id));

            if (resultIngredientes) {
                if (resultIngredientes.length > 0) {
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status;
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code;
                    MESSAGES.DEFAULT_HEADER.ingredientes = resultIngredientes;

                    return MESSAGES.DEFAULT_HEADER;
                } else {
                    return MESSAGES.ERROR_NOT_FOUND;
                }
            } else {
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
            }
        } else {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += "[ID incorreto]";
            return MESSAGES.ERROR_REQUIRED_FIELDS;
        }

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
};

const inserirIngrediente = async function (ingrediente, contentType) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

    try {
        //validar o tipo de conteudo, pois precisa ser json
        if (String(contentType).toUpperCase() == "APPLICATION/JSON") {
            let resultIngredientes = await ingredientesDAO.setInsertIngredient(ingrediente);

            if (resultIngredientes) {
                //chama a função para receber o id que foi gerado no banco de dados
                let lastID = await ingredientesDAO.getSelectLastId();

                if (lastID) {
                    ingrediente.id = lastID;
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_CREATED_ITEM.status;
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code;
                    MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_CREATED_ITEM.message;

                    let getIngrediente = await buscarIngredientesId(ingrediente.id);

                    let ingredienteData = {
                        id: getIngrediente.ingredientes[0].id,
                        nome: getIngrediente.ingredientes[0].nome,
                        alergeno: getIngrediente.ingredientes[0].alergeno,
                        tipo: getIngrediente.ingredientes[0].tipo
                    };

                    MESSAGES.DEFAULT_HEADER.ingrediente = ingredienteData;
                    return MESSAGES.DEFAULT_HEADER;
                } else {
                    return MESSAGES.ERROR_INTERNAL_SERVER_MODEL;
                }
            } else {
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL;
            }
        } else {
            return MESSAGES.ERROR_CONTENT_TYPE;
        }
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
};

const atualizarIngrediente = async function (ingrediente, id, contentType) {
    try {
        let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

        if (String(contentType).toUpperCase() == "APPLICATION/JSON") {

            // Validação do ID
            let validarID = await buscarIngredientesId(id);

            if (validarID.status_code == 200) {

                // Atualização no banco de dados
                let resultIngredientes = await ingredientesDAO.setUpdateIngredient(ingrediente, id);

                if (resultIngredientes) {
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_UPDATED_ITEM.status;
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_UPDATED_ITEM.status_code;
                    MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_UPDATED_ITEM.message;
                    MESSAGES.DEFAULT_HEADER.ingrediente = ingrediente;

                    return MESSAGES.DEFAULT_HEADER; // 200
                } else {
                    return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; // 500
                }

            } else {
                return validarID; // 400, 404 ou 500 da validação do ID
            }

        } else {
            return MESSAGES.ERROR_CONTENT_TYPE; // 415
        }

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER; // 500
    }
}

const excluirIngrediente = async function (id) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));
    
      try {
        //Validação da chegada do ID
        if (!isNaN(id) && id != "" && id != null && id > 0) {
          //Validação de ID válido, chama a função da controller que verifica no BD se o ID existe e valida o ID
          let validarID = await buscarIngredientesId(id);
    
          if (validarID.status_code == 200) {
            let resultIngredientes = await ingredientesDAO.setDeleteIngredient(Number(id));
    
            if (resultIngredientes) {
              MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_DELETED_ITEM.status;
              MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_DELETED_ITEM.status_code;
              MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_DELETED_ITEM.message;
              MESSAGES.DEFAULT_HEADER.ingrediente = resultIngredientes;
              
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
    listarIngredientes,
    buscarIngredientesId,
    inserirIngrediente,
    atualizarIngrediente,
    excluirIngrediente

}