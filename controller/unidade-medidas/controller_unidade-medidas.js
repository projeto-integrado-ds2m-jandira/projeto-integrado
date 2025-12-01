/*****************************************************************************************************
 * Objetivo: Arquivo responsavel pelo a interação do app com a model para o CRUD de unidades de medida
 * 
 * Autor: Samara Santos
 * 
 * Data: 27/11/2025
 * 
 *  Versão: 1.0 
 *********************************************************************************************************/

const unidadeMedidaDao = require("../../model/DAO/unidades-medidas.js")
const { buscarCategoriaId } = require("../categorias/controller_categorias")

const DEFAULT_MESSAGES = require("../messages/config_messages.js")

const listarTodasUnidadesMedida = async () => {

    const MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        // chamando a função do DAO par retornar todas as unidades de medidas    
        let resultListarUnidades = await unidadeMedidaDao.getSelectAllUnits()


        if (resultListarUnidades) {
            //validando se a unidade de medida está vazia
            if (resultListarUnidades.length > 0) {
                MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                MESSAGES.DEFAULT_HEADER.items.medida = resultListarUnidades

                return MESSAGES.DEFAULT_HEADER
            } else {
                return MESSAGES.ERROR_NOT_FOUND
            }

        } else {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarUnidadeMedidaId = async (id) => {

    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        // validando se o id veio corretamente
        if (!isNaN(id) && id != "" && id != null && id > 0) {
            let resultBuscarUnidade = await unidadeMedidaDao.getSelectUnitById(id)

            if (resultBuscarUnidade) {
                if (resultBuscarUnidade.length > 0) {
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.DEFAULT_HEADER.items.medida = resultBuscarUnidade

                    return MESSAGES.DEFAULT_HEADER
                } else {
                    return MESSAGES.ERROR_NOT_FOUND
                }
            } else {
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
            }
        } else {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += "[ID incorreto]"

            return MESSAGES.ERROR_REQUIRED_FIELDS
        }
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}

const inserirUnidadeMedida = async (medida, contentType) => {

    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if (String(contentType).toUpperCase() == "APPLICATION/JSON") {

            let resultInserirUnidade = await unidadeMedidaDao.setInsertUnit(medida)

            if (resultInserirUnidade) {

                let lastID = await unidadeMedidaDao.getSelectLastId()

                if (lastID) {

                    medida.id = lastID
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_CREATED_ITEM.status
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code
                    MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_CREATED_ITEM.message

                    MESSAGES.DEFAULT_HEADER.items = medida

                    return MESSAGES.DEFAULT_HEADER

                } else {
                    return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
                }
            } else {
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
            }
        } else {
            return MESSAGES.ERROR_CONTENT_TYPE
        }

    } catch (error) {
         console.log(error)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
       
    }
}

const atualizarUnidadeMedida = async (medida, id, contentType) => {

    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if (String(contentType).toUpperCase() == "APPLICATION/JSON") {

            let validarID = await buscarUnidadeMedidaId(id)

            if (validarID.status_code == 200) {

                let resultAtualizarUnidade = await unidadeMedidaDao.setUpdateUnit(medida, id)

                if (resultAtualizarUnidade) {
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_UPDATED_ITEM.status
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_UPDATED_ITEM.status_code
                    MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_UPDATED_ITEM.message
                    MESSAGES.DEFAULT_HEADER.medida = medida

                    delete MESSAGES.DEFAULT_HEADER.items

                    return MESSAGES.DEFAULT_HEADER
                } else {
                    return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
                }
            } else {
                validarID
            }
        } else {
            return MESSAGES.ERROR_CONTENT_TYPE
        }

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}

const deletarUnidadeMedida = async (id) => {

    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if(!isNaN(id) && id != "" && id != null && id > 0){

            let validarID = await buscarUnidadeMedidaId(id)

            if(validarID.status_code == 200){

                let resultUnidadeMedida = await unidadeMedidaDao.setDeleteUnit(Number(id))

                if(resultUnidadeMedida){

                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_DELETED_ITEM.status
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_DELETED_ITEM.status_code
                    MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_DELETED_ITEM.message
                    MESSAGES.DEFAULT_HEADER.items.medida = resultUnidadeMedida

                    delete MESSAGES.DEFAULT_HEADER.items
                    return MESSAGES.DEFAULT_HEADER
                    
                } else{
                    return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
                }

            }else{
                return MESSAGES.ERROR_NOT_FOUND
            }
        } else{
            MESSAGES.ERROR_REQUIRED_FIELDS.message += " [ID incorreto] "
            return MESSAGES.ERROR_REQUIRED_FIELDS
        }

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}

module.exports = {
    listarTodasUnidadesMedida,
    buscarUnidadeMedidaId,
    buscarCategoriaId,
    inserirUnidadeMedida,
    atualizarUnidadeMedida,
    deletarUnidadeMedida

}