/* *********************************************************************
 * Objetivo: Arquivo responsavel pela manipulação de dados entre o APP e a MODEL para o CRUD de dificuldades
 *
 * Autores: Samara Santos, Maria Cecilia
 *
 * Data: 01/12/2025
 * Versão: 1.0 (CRUD básico de dificuldades, sem as relações com outras tabelas)
 * **********************************************************************/

const dificuldadesDAO = require("../../model/DAO/dificuldades.js")

const DEFAULT_MESSAGES = require("../messages/config_messages.js")


const listarDificuldades = async function () {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

    try {
        //chama a função do DAO para retornar a lista de ingredientes do DB
        let resultDificuldades = await dificuldadesDAO.getSelectAllDifficulties();

        if (resultDificuldades) {
            if (resultDificuldades.length > 0) {
                MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status;
                MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code;
                MESSAGES.DEFAULT_HEADER.dificuldade = resultDificuldades;

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

const buscarDificuldadeId = async function (id) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

    try {
        if (!isNaN(id) && id != "" && id != null && id > 0) {
            let resultDificuldades = await dificuldadesDAO.getSelectDifficultyById(Number(id));

            if (resultDificuldades) {
                if (resultDificuldades.length > 0) {
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status;
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code;
                    MESSAGES.DEFAULT_HEADER.items.dificuldades = resultDificuldades;

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

const inserirDificuldade = async function (dificuldade, contentType) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

    try {
        //validar o tipo de conteudo, pois precisa ser json
        if (String(contentType).toUpperCase() == "APPLICATION/JSON") {
            let resultDificuldades = await dificuldadesDAO.setInsertDifficulty(dificuldade);

            console.log(resultDificuldades);

            if (resultDificuldades) {
                //chama a função para receber o id que foi gerado no banco de dados
                let lastID = await dificuldadesDAO.getSelectLastId();

                if (lastID) {
                    dificuldade.id = lastID;
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_CREATED_ITEM.status;
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code;
                    MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_CREATED_ITEM.message;

                    let getDificuldade = await buscarDificuldadeId(dificuldade.id);

                    let dificuldadeData = {
                        id: getDificuldade.items.dificuldades[0].id,
                        nome: getDificuldade.items.dificuldades[0].nome
                    };

                    delete MESSAGES.DEFAULT_HEADER.items;
                    MESSAGES.DEFAULT_HEADER.dificuldade = dificuldadeData;
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


const atualizarDificuldade = async function (dificuldade, id, contentType) {
    try {
        let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

        if (String(contentType).toUpperCase() == "APPLICATION/JSON") {

            // Validação do ID
            let validarID = await buscarDificuldadeId(id);

            if (validarID.status_code == 200) {

                // Atualização no banco de dados
                let resultDificuldades = await dificuldadesDAO.setUpdateDifficulty(dificuldade, id);

                if (resultDificuldades) {
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_UPDATED_ITEM.status;
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_UPDATED_ITEM.status_code;
                    MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_UPDATED_ITEM.message;
                    MESSAGES.DEFAULT_HEADER.items.dificuldade = dificuldade;

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
};

const excluirDificuldade = async function (id) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

    try {
        //Validação da chegada do ID
        if (!isNaN(id) && id != "" && id != null && id > 0) {
            //Validação de ID válido, chama a função da controller que verifica no BD se o ID existe e valida o ID
            let validarID = await buscarDificuldadeId(id);

            if (validarID.status_code == 200) {
                let resultDificuldades = await dificuldadesDAO.setDeleteDifficulty(Number(id));

                if (resultDificuldades) {
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_DELETED_ITEM.status;
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_DELETED_ITEM.status_code;
                    MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_DELETED_ITEM.message;
                    MESSAGES.DEFAULT_HEADER.items.dificuldade = resultDificuldades;
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
    listarDificuldades,
    buscarDificuldadeId,
    inserirDificuldade,
    atualizarDificuldade,
    excluirDificuldade
}