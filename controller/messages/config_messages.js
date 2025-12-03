/******************************************************************************
 * Objetivo: Arquivo responsável pelos padrões de mensagens que o projeto irá
 * realizar, sempre no formato JSON (Mensagens de erro e sucesso, etc)
 * Data: 25/11/2025
 * Autor: Tiago
 * Versão: 1.0
 *****************************************************************************/

//Cria um objeto da classe Date para pegar a data atual
const dataAtual = new Date();

/*************************MENSAGENS PADRONIZADAS *****************************/
const DEFAULT_HEADER = {
  api_description:
    "API para manipular dados do site de receitas para o Projeto Integrado DS2M",
  status: Boolean,
  status_code: Number,
  request_date: dataAtual.toString(), //toLocaleString()
};

/*************************MENSAGENS DE SUCESSO *****************************/
const SUCCESS_REQUEST = {
  status: true,
  status_code: 200,
  message: "Requisição bem sucedida!!!",
};
const SUCCESS_CREATED_ITEM = {
  status: true,
  status_code: 201,
  message: "Item criado com sucesso!!!",
};
const SUCCESS_UPDATED_ITEM = {
  status: true,
  status_code: 200,
  message: "Item atualizado com sucesso!!!",
};
const SUCCESS_DELETED_ITEM = {
  status: true,
  status_code: 200,
  message: "Item excluído com sucesso!!!",
};
/*************************MENSAGENS DE ERRO  *****************************/
const ERROR_NOT_FOUND = {
  status: false,
  status_code: 404,
  message: "Não foram encontrados dados de retorno!!!",
};
const ERROR_INTERNAL_SERVER_CONTROLLER = {
  status: false,
  status_code: 500,
  message:
    "Não foi possível processar a requisição, devido a erros internos no servidor (CONTROLLER)!!!",
};
const ERROR_INTERNAL_SERVER_MODEL = {
  status: false,
  status_code: 500,
  message:
    "Não foi possível processar a requisição, devido a erros internos no servidor (MODELAGEM DE DADOS)!!!",
};
const ERROR_REQUIRED_FIELDS = {
  status: false,
  status_code: 400,
  message:
    "Não foi possível processar a requisição, pois existem campos obrigatórios que devem ser encaminhados e atendidos conforme documentação!!!",
};
const ERROR_CONTENT_TYPE = {
  status: false,
  status_code: 415,
  message:
    "Não foi possível processar a requisição, pois o tipo de dados enviado no corpo deve ser JSON !!!",
};

const ERROR_RELATIONAL_INSERTION = {
  status: false,
  status_code: 500,
  message:
    "O item requisitado foi inserido, porém houve erro ao inserir dados na tabela relacional.",
};

module.exports = {
  DEFAULT_HEADER,
  SUCCESS_REQUEST,
  SUCCESS_CREATED_ITEM,
  SUCCESS_UPDATED_ITEM,
  SUCCESS_DELETED_ITEM,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER_CONTROLLER,
  ERROR_INTERNAL_SERVER_MODEL,
  ERROR_REQUIRED_FIELDS,
  ERROR_CONTENT_TYPE,
  ERROR_RELATIONAL_INSERTION,
};
