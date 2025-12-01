/* *********************************************************************
 * Objetivo: Arquivo responsavel pela manipulação de dados entre o APP e a MODEL para o CRUD de tipo_cozinha
 * Autor: Rebeca Gomes
 * Data: 27/11/2025
 * Versão: 1.0 (CRUD básico de tipo_cozinha, sem as relações com outras tabelas)
 * **********************************************************************/

//import da model do DAO das receitas
const tipoCozinhaDAO = require("../../model/DAO/tipo-cozinha.js")

//import do arquivo de mensagens
const DEFAULT_MESSAGES = require("../messages/config_messages.js")

//Retorna ums lista de todos os tipos de cozinha do banco de dados
const listarTipoCozinha = async () => {
    //criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Chama a função do DAO para retornar a lista de tipo_cozinha do banco de dados
        let resultTipoCozinha = await tipoCozinhaDAO.getSelectAllCuisines()

        if (resultTipoCozinha) {
            if (resultTipoCozinha.length > 0) {
                MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                MESSAGES.DEFAULT_HEADER.items.receitas = resultTipoCozinha

                return MESSAGES.DEFAULT_HEADER //200
            } else {
                return MESSAGES.ERROR_NOT_FOUND //404
            }
        } else {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
        }
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Retorna um tipo de cozinha filtrando pelo id
const buscarTipoCozinhaId = async (id) => {
    // Criando um novo objeto para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação da chegada do id
        if (!isNaN(id) && id != "" && id != null && id > 0) {
            let resultTipoCozinha = await tipoCozinhaDAO.getSelectCuisineById(Number(id))

            if (resultTipoCozinha) {
                if (resultTipoCozinha.length > 0) {
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.DEFAULT_HEADER.items.tipoCozinha = resultTipoCozinha

                    return MESSAGES.DEFAULT_HEADER
                } else {
                    return MESSAGES.ERROR_NOT_FOUND //404
                }
            } else {
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
            }
        } else {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += "[id incorreto!]"
            return MESSAGES.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Insere um tipo de cozinha
/* Vazio, undefined e null estão sendo cadastrados no banco. Tratar pelo front */
const inserirTipoCozinha = async (tipoCozinha, contentType) => {
    //Criando um novo objeto para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (Obrigatório ser um json)
        if (String(contentType).toUpperCase() == "APPLICATION/JSON") {
            //Chama a função para inserir um novo tipo de cozinha no banco de dados
            let resultTipoCozinha = await tipoCozinhaDAO.setInsertCuisine(tipoCozinha)

            if (resultTipoCozinha) {
                //Chama a função para receber o id gerado pelo banco de dados
                let lastID = await tipoCozinhaDAO.getSelectLastId()

                if (lastID) {
                    //Adiciona o id no JSON ocm os dados do tipo de cozinha
                    tipoCozinha.id = lastID
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_CREATED_ITEM.status
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code
                    MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_CREATED_ITEM.message
                    MESSAGES.DEFAULT_HEADER.items = tipoCozinha

                    return MESSAGES.DEFAULT_HEADER //201
                } else {
                    return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
                }
            } else {
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
            }
        } else {
            return MESSAGES.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Atualiza um tipo cozinha buscando por id
const atualizarTipoCozinha = async (tipoCozinha, id, contentType) => {
    //Criando um novo objeto para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //validação do tipo de conteudo da requisição (obrigatorio ser um json)
        if (String(contentType).toUpperCase() == "APPLICATION/JSON") {
            //validação de ID válido, chama a função da controller que verifica no DB se o ID existe e valida o ID
            let validarID = await buscarTipoCozinhaId(id)

            if(validarID.status_code == 200) {
                //Chama a função para inserir um novo tipo de cozinha no Banco de dados
                let resultTipoCozinha = await tipoCozinhaDAO.setUpdateCuisine(tipoCozinha, id)
                if (resultTipoCozinha) {
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_UPDATED_ITEM.status
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_UPDATED_ITEM.status_code
                    MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_UPDATED_ITEM.message
                    MESSAGES.DEFAULT_HEADER.items.tipoCozinha = tipoCozinha

                    return MESSAGES.DEFAULT_HEADER //200
                } else {
                    return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
                }
            } else {
                return validarID //Poderá retornar 400, 404 ou 500
            }
         } else {
            return MESSAGES.ERROR_CONTENT_TYPE //415
         }

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Exclui um tipo cozinha buscando pelo id
const excluirTipoCozinha = async (id) => {
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação da chegada do id
        if (!isNaN(id) && id != "" && id != null && id > 0) {
            //Validação de ID válido, chama a função da controller que verifica no BD se o ID existe e valida o ID
            let validarID = await buscarTipoCozinhaId(id)

            if (validarID.status_code == 200) {
                let resultTipoCozinha = await tipoCozinhaDAO.setDeleteCuisine(Number(id))


                if (resultTipoCozinha) {
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_DELETED_ITEM.status
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_DELETED_ITEM.status_code
                    MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_DELETED_ITEM.message
                    MESSAGES.DEFAULT_HEADER.items.tipoCozinha = resultTipoCozinha
                    delete MESSAGES.DEFAULT_HEADER.items //200

                    return MESSAGES.DEFAULT_HEADER //500
                } else {
                    return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
                }
            } else {
                return MESSAGES.ERROR_NOT_FOUND //404
            }
        } else {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += " [id incorreto]"
            return MESSAGES.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}


module.exports = {
    listarTipoCozinha,
    buscarTipoCozinhaId,
    inserirTipoCozinha,
    atualizarTipoCozinha,
    excluirTipoCozinha
}