/******************************************************************************
 * Objetivo: Arquivo responsável pelas requisições da API do site de receitas
 * Data: 25/10/2025
 * Autor: Tiago
 * Versão: 1.0
 *****************************************************************************/

//Import das bibliotecas para criar a API
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

//Cria um objeto especialista no formato JSON para receber dados via POST e PUT
const bodyParserJSON = bodyParser.json();

//Cria o objeto app para criar a API
const app = express();

//Porta
const PORT = process.PORT || 8080;

//Configurações do cors
app.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  app.use(cors());
  next();
});

//Import das controllers
const controllerUsuario = require("./controller/usuario/controller_usuario.js");

//EndPoints para a rota de Usuário

//Retorna a lista de todos os usuários
app.get("/queridofogao/v1/usuarios", cors(), async function (request, response) {
  //Chama a função para listar os usuários do BD
  let usuario = await controllerUsuario.listarUsuarios();

  response.status(usuario.status_code);
  response.json(usuario);
});

/////////////////////////////////////////

// Start da API
app.listen(PORT, function () {
  console.log("API Aguardando Requisições !!!");
});
