/******************************************************************************
 * Objetivo: Arquivo responsável pelas requisições da API do site de receitas
 * Data Inicio: 25/11/2025
 * Versão: 0.1 - CRUD de usuários - Release: 26/11/2025 - Autor: Tiago Guimarães
 * Versão: 0.2 - CRUD de receitas
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

///////////////////  EndPoints para a rota de Usuário ////////////////////////////

// Retorna a lista de todos os usuários
app.get("/queridofogao/v1/usuarios", cors(), async function (request, response) {
  //Chama a função para listar os usuários do BD
  let usuario = await controllerUsuario.listarUsuarios();

  response.status(usuario.status_code);
  response.json(usuario);
});

//Retorna o usuario filtrando pelo ID
app.get("/queridofogao/v1/usuarios/:id", cors(), async function (request, response) {
  //Recebe o ID encaminhado via parametro na requisição
  let idUsuario = request.params.id;

  //Chama a função para listar os usuarios do BD
  let usuario = await controllerUsuario.buscarUsuarioId(idUsuario);

  response.status(usuario.status_code);
  response.json(usuario);
});

//Insere um novo usuario
app.post("/queridofogao/v1/usuarios", cors(), bodyParserJSON, async function (request, response) {
  //Recebe os dados do body da requisição (Se você utilizar o bodyParser, é obrigatório ter no endPoint)
  let dadosBody = request.body;

  //Recebe o tipo de dados da requisição (JSON ou XML ou ....)
  let contentType = request.headers["content-type"];

  //Chama a função da controller para inserir o novo usuario, encaminha os dados e o content-type
  let usuario = await controllerUsuario.inserirUsuario(dadosBody, contentType);

  response.status(usuario.status_code);
  response.json(usuario);
});

//Atualiza um usuario existente
app.put("/queridofogao/v1/usuarios/:id", cors(), bodyParserJSON, async function (request, response) {
  //Recebe o ID do usuario
  let idUsuario = request.params.id;

  //Recebe os dados a serem atualizados
  let dadosBody = request.body;

  //Recebe o content-type da requisição
  let contentType = request.headers["content-type"];

  //chama a função para atualizar o usuario e encaminha os dados, o id e o content-type
  let usuario = await controllerUsuario.atualizarUsuario(dadosBody, idUsuario, contentType);

  response.status(usuario.status_code);
  response.json(usuario);
});

// Deleta o usuario filtrando pelo ID
app.delete("/queridofogao/v1/usuarios/:id", cors(), async function (request, response) {
  //Recebe o ID encaminhado via parametro na requisição
  let idUsuario = request.params.id;

  //Chama a função para listar os usuarios do BD
  let usuario = await controllerUsuario.excluirUsuario(idUsuario);
  //console.log(usuario)
  response.status(usuario.status_code);
  response.json(usuario);
});

/////////////////////////////////////////

// Start da API
app.listen(PORT, function () {
  console.log("API Aguardando Requisições !!!");
});
