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
                MESSAGES.DEFAULT_HEADER.items.ingredientes = resultIngredientes;

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
        if(!isNaN(id) && id != "" && id != null && id > 0){
            let resultIngredientes = await ingredientesDAO.getSelectIngredientById(Number(id));

            if(resultIngredientes){
                if(resultIngredientes.length > 0){
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status;
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code;
                    MESSAGES.DEFAULT_HEADER.items.ingredientes = resultIngredientes;

                    return MESSAGES.DEFAULT_HEADER;
                }else{
                    return MESSAGES.ERROR_NOT_FOUND;
                }
            }else{
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
            }
        }else{
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
        if(String(contentType).toUpperCase() == "APPLICATION/JSON"){
            let resultIngredientes = await ingredientesDAO.setInsertIngredient(ingrediente);

            if (resultIngredientes) {
                //chama a função para receber o id que foi gerado no banco de dados
                let lastID = await ingredientesDAO.getSelectLastId();

                if(lastID){
                    ingrediente.id = lastID;
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_CREATED_ITEM.status;
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code;
                    MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_CREATED_ITEM.message;

                    let getIngrediente = await buscarIngredientesId(ingrediente.id);

                    let ingredienteData = {
                        id: getIngrediente.items.ingredientes[0].id,
                        nome: getIngrediente.items.ingredientes[0].nome,
                        alergeno: getIngrediente.items.ingredientes[0].alergeno,
                        tipo: getIngrediente.items.ingredientes[0].tipo
                    };
                }
            }
        }
    } catch (error) {
        
    }
    
}

module.exports= {
    listarIngredientes,
    buscarIngredientesId,
}