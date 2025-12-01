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
const controllerReceita = require("./controller/receitas/controller_receitas.js");
const controllerCategoria = require("./controller/categorias/controller_categorias.js");
const controllerUnidadeMedida = require("./controller/unidade-medidas/controller_unidade-medidas.js")
const controllerIngrediente = require("./controller/ingredientes/controller_ingredientes.js");
const controllerDificuldades = require("./controller/dificuldades/controller_dificuldades.js");


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

///////////////////  EndPoints para a rota de Receitas ////////////////////////////

// Retorna a lista de todas as receitas
app.get("/queridofogao/v1/receitas", cors(), async function (request, response) {
  //Chama a função para listar as receitas do BD
  let receita = await controllerReceita.listarReceitas();

  response.status(receita.status_code);
  response.json(receita);
});

//Retorna a receita filtrando pelo ID
app.get("/queridofogao/v1/receitas/:id", cors(), async function (request, response) {
  //Recebe o ID encaminhado via parametro na requisição
  let idReceita = request.params.id;

  //Chama a função para listar as receitas do BD
  let receita = await controllerReceita.buscarReceitaId(idReceita);

  response.status(receita.status_code);
  response.json(receita);
});

//Insere uma nova receita
app.post("/queridofogao/v1/receitas", cors(), bodyParserJSON, async function (request, response) {
  //Recebe os dados do body da requisição (Se você utilizar o bodyParser, é obrigatório ter no endPoint)
  let dadosBody = request.body;

  //Recebe o tipo de dados da requisição (JSON ou XML ou ....)
  let contentType = request.headers["content-type"];

  //Chama a função da controller para inserir o novo usuario, encaminha os dados e o content-type
  let receita = await controllerReceita.inserirReceita(dadosBody, contentType);

  response.status(receita.status_code);
  response.json(receita);
});

//Atualiza uma receita existente
app.put("/queridofogao/v1/receitas/:id", cors(), bodyParserJSON, async function (request, response) {
  //Recebe o ID da receita
  let idReceita = request.params.id;

  //Recebe os dados a serem atualizados
  let dadosBody = request.body;

  //Recebe o content-type da requisição
  let contentType = request.headers["content-type"];

  //chama a função para atualizar a receita e encaminha os dados, o id e o content-type
  let receita = await controllerReceita.atualizarReceita(dadosBody, idReceita, contentType);

  response.status(receita.status_code);
  response.json(receita);
});

// Deleta a receita filtrando pelo ID
app.delete("/queridofogao/v1/receitas/:id", cors(), async function (request, response) {
  //Recebe o ID encaminhado via parametro na requisição
  let idReceita = request.params.id;

  //Chama a função para listar as receitas do BD
  let receita = await controllerReceita.excluirReceita(idReceita);
  //console.log(receita)
  response.status(receita.status_code);
  response.json(receita);
});

///////////////////  EndPoints para a rota de Categorias ////////////////////////////

//retorna uma lista de todas as categorias
app.get("/queridofogao/v1/categorias", cors(), async function (request, response) {

  let categoria = await controllerCategoria.listarCategorias();

  response.status(categoria.status_code);
  response.json(categoria);
});

//retorna a categoria filtrando pelo id.
app.get("/queridofogao/v1/categorias/:id", cors(), async function (request, response) {
  //Recebe o ID encaminhado via parametro na requisição
  let idCategoria = request.params.id;

  //Chama a função para listar os usuarios do BD
  let categoria = await controllerCategoria.buscarCategoriaId(idCategoria);

  response.status(categoria.status_code);
  response.json(categoria);
});

//Insere uma nova categoria
app.post("/queridofogao/v1/categorias", cors(), bodyParserJSON, async function (request, response) {

  let dadosBody = request.body;

  let contentType = request.headers["content-type"];

  //Chama a função da controller para inserir o novo usuario, encaminha os dados e o content-type
  let categoria = await controllerCategoria.inserirCategoria(dadosBody, contentType);

  response.status(categoria.status_code);
  response.json(categoria);
});

//Atualiza uma categoria existente
app.put("/queridofogao/v1/categorias/:id", cors(), bodyParserJSON, async function (request, response) {
  //Recebe o ID do usuario
  let idCategoria = request.params.id;

  //Recebe os dados a serem atualizados
  let dadosBody = request.body;

  //Recebe o content-type da requisição
  let contentType = request.headers["content-type"];

  //chama a função para atualizar o usuario e encaminha os dados, o id e o content-type
  let categoria = await controllerCategoria.atualizarCategoria(dadosBody, idCategoria, contentType);

  response.status(categoria.status_code);
  response.json(categoria);
});

// Deleta a categoria filtrando pelo ID
app.delete("/queridofogao/v1/categorias/:id", cors(), async function (request, response) {

  let idCategoria = request.params.id;

  let categoria = await controllerCategoria.excluirCategoria(idCategoria);
  //console.log(usuario)
  response.status(categoria.status_code);
  response.json(categoria);
});


//////////////////////////////////End Points unidade de medidas ///////////////////////////////////////

app.get("/queridofogao/v1/medidas", cors(), async function (resquest, response) {

  let medidas = await controllerUnidadeMedida.listarTodasUnidadesMedida()

  response.status(medidas.status_code)
  response.json(medidas)
  
} )


app.get("/queridofogao/v1/medidas/:id", cors(), async function (request, response) {

  let idMedida = request.params.id

  let medida = await controllerUnidadeMedida.buscarUnidadeMedidaId(idMedida)




  response.status(medida.status_code)

  response.json(medida)
  

})

app.post("/queridofogao/v1/medidas", cors(), bodyParserJSON, async function (request, response) {
  
  let dadosBody = request.body

  let contentType = request.headers["content-type"]

  let medida = await controllerUnidadeMedida.inserirUnidadeMedida(dadosBody , contentType)

  console.log(medida)

  response.status(medida.status_code)
  response.json(medida)

})

app.put("/queridofogao/v1/medidas/:id", cors(), bodyParserJSON, async function (request, response) {

  let idMedida = request.params.id

  let dadosBody = request.body

  let contentType = request.headers["content-type"]

  let medida = await controllerUnidadeMedida.atualizarUnidadeMedida(dadosBody, idMedida, contentType)

  console.log(medida)

  response.status(medida.status_code)
  response.json(medida)

})

app.delete("/queridofogao/v1/medidas/:id" , cors(), async function (request, response) {

  let idMedida = request.params.id

  let medida = await controllerUnidadeMedida.deletarUnidadeMedida(idMedida)

  response.status(medida.status_code)
  response.json(medida)

  
})


///////////////////  EndPoints para a rota de Ingredientes ////////////////////////////

app.get("/queridofogao/v1/ingredientes", cors(), async function (request, response) {
  //Chama a função para listar os usuários do BD
  let ingrediente = await controllerIngrediente.listarIngredientes();

  response.status(ingrediente.status_code);
  response.json(ingrediente);
});

app.get("/queridofogao/v1/ingredientes/:id", cors(), async function (request, response) {
  //Recebe o ID encaminhado via parametro na requisição
  let idIngrediente = request.params.id;

  //Chama a função para listar os usuarios do BD
  let ingrediente = await controllerIngrediente.buscarIngredientesId(idIngrediente);

  response.status(ingrediente.status_code);
  response.json(ingrediente);
});

app.post("/queridofogao/v1/ingredientes", cors(), bodyParserJSON, async function (request, response) {
  //Recebe os dados do body da requisição (Se você utilizar o bodyParser, é obrigatório ter no endPoint)
  let dadosBody = request.body;

  //Recebe o tipo de dados da requisição (JSON ou XML ou ....)
  let contentType = request.headers["content-type"];

  //Chama a função da controller para inserir o novo usuario, encaminha os dados e o content-type
  let ingrediente = await controllerIngrediente.inserirIngrediente(dadosBody, contentType);

  response.status(ingrediente.status_code);
  response.json(ingrediente);
});

app.put("/queridofogao/v1/ingredientes/:id", cors(), bodyParserJSON, async function (request, response) {
  //Recebe o ID do usuario
  let idIngrediente = request.params.id;

  //Recebe os dados a serem atualizados
  let dadosBody = request.body;

  //Recebe o content-type da requisição
  let contentType = request.headers["content-type"];

  //chama a função para atualizar o usuario e encaminha os dados, o id e o content-type
  let ingrediente = await controllerIngrediente.atualizarIngrediente(dadosBody, idIngrediente, contentType);

  response.status(ingrediente.status_code);
  response.json(ingrediente);
});

app.delete("/queridofogao/v1/ingredientes/:id", cors(), async function (request, response) {
  //Recebe o ID encaminhado via parametro na requisição
  let idIngrediente = request.params.id;

  //Chama a função para listar os usuarios do BD
  let ingrediente = await controllerIngrediente.excluirIngrediente(idIngrediente);
  //console.log(usuario)
  response.status(ingrediente.status_code);
  response.json(ingrediente);
});



/////////////////////////////////////////

/////////////////////////// EndPoints para a rota de tipo_cozinha ///////////////////////////////////////

//Retorna a lista de todos os tipos de cozinha
app.get("/queridofogao/v1/tipoCozinha", cors(), async function (request, response) {
  //Chama a função para listar os tipo de cozinha do banco de dados
  let tipoCozinha = await controllerTipoCozinha.listarTipoCozinha()

  response.status(tipoCozinha.status_code)
  response.json(tipoCozinha)
  
})

//Retorna a receita filtrando pelo Id
app.get("/queridofogao/v1/tipoCozinha/:id", cors(), bodyParserJSON, async function (request, response) {
  //Recebe o id encaminhando via parâmetro na requisição
  let idTipoCozinha = request.params.id

  //Chama a função para listar as receitas do Banco de Dados
  let tipoCozinha = await controllerTipoCozinha.buscarTipoCozinhaId(idTipoCozinha)

  response.status(tipoCozinha.status_code)
  response.json(tipoCozinha)
})

//Insere um novo tipo de cozinha
app.post("/queridofogao/v1/tipoCozinha", cors(), bodyParserJSON, async function (request, response) {
  //Recebe os dados do body da requisição (Se você utilizar o bodyParser, é obrigatório ter no endPoint)
  let dadosBody = request.body

  //Recebe o tipo de dados da requisição (JSON ou XML ou ....)
  let contentType = request.headers["content-type"];

  //Chama a função da controller para inserir o novo usuario, encaminha os dados e o content-type
  let tipoCozinha = await controllerTipoCozinha.inserirTipoCozinha(dadosBody, contentType)

  response.status(tipoCozinha.status_code)
  response.json(tipoCozinha)
})

//Atualiza um tipo de cozinha existente
app.put("/queridofogao/v1/tipoCozinha/:id", cors(), bodyParserJSON, async function (request, response) {
  //Recebe o id do tipo cozinha
  let idTipoCozinha = request.params.id

  //Recebe os dados a serem atualizados
  let dadosBody = request.body


  //Recebe o content-type da requisição
  let contentType = request.headers["content-type"]


  //Chama a função para atualizar o tipo cozinha e encaminha os dados, o id e o content-type
  let tipoCozinha = await controllerTipoCozinha.atualizarTipoCozinha(dadosBody, idTipoCozinha, contentType)


  response.status(tipoCozinha.status_code)
  response.json(tipoCozinha)
})

// Deleta um tipo cozinha filtrando pelo ID
app.delete("/queridofogao/v1/tipoCozinha/:id", cors(), async function (request, response) {
  //Recebe o ID encaminhado via parametro na requisição
  let idTipoCozinha = request.params.id;

  //Chama a função para listar as receitas do BD
  let tipoCozinha = await controllerTipoCozinha.excluirTipoCozinha(idTipoCozinha);
  //console.log(receita)
  response.status(tipoCozinha.status_code);
  response.json(tipoCozinha);
});


/////////////////////////// EndPoints para a rota de tipo_cozinha ///////////////////////////////////////

app.get("/queridofogao/v1/dificuldades", cors(), async function (request, response) {
  //Chama a função para listar os usuários do BD
  let dificuldade = await controllerDificuldades.listarDificuldades();

  response.status(dificuldade.status_code);
  response.json(dificuldade);
});

app.get("/queridofogao/v1/dificuldades/:id", cors(), async function (request, response) {
  //Recebe o ID encaminhado via parametro na requisição
  let idDificuldade = request.params.id;

  //Chama a função para listar os usuarios do BD
  let dificuldade = await controllerDificuldades.buscarDificuldadeId(idDificuldade);

  response.status(dificuldade.status_code);
  response.json(dificuldade);
});


// Start da API
app.listen(PORT, function () {
  console.log("API Aguardando Requisições !!!");
});
