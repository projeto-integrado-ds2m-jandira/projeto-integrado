/* *********************************************************************
 * Objetivo: Arquivo responsavel pela manipulação de dados entre o APP e a MODEL para o CRUD de receitas
 *
 * Autor: Tiago Guimarães
 *
 * Data: 25/11/2025
 * Versão: 1.0 (CRUD básico de receitas, sem as relações com outras tabelas)
 * **********************************************************************/

// import da model do DAO das receitas
const receitaDAO = require("../../model/DAO/receita.js");

//import do arquivo de mensagens
const DEFAULT_MESSAGES = require("../messages/config_messages.js");

// Retorna uma lista de todos as receitas do banco de dados
const listarReceitas = async () => {
  //criando um objeto novo para as mensagens
  let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

  try {
    //chama a função do DAO para retornar a lista de receitas do DB
    let resultReceitas = await receitaDAO.getSelectAllRecipes();

    if (resultReceitas) {
      if (resultReceitas.length > 0) {
        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status;
        MESSAGES.DEFAULT_HEADER.status_code =
          MESSAGES.SUCCESS_REQUEST.status_code;
        MESSAGES.DEFAULT_HEADER.receitas = resultReceitas;

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

// retorna uma receita filtrando pelo ID
const buscarReceitaId = async (id) => {
  //criando um objeto novo para as mensagens
  let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

  try {
    //validação da chegada do ID
    if (!isNaN(id) && id != "" && id != null && id > 0) {
      let resultReceitas = await receitaDAO.getSelectRecipesById(Number(id));

      if (resultReceitas) {
        if (resultReceitas.length > 0) {
          MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status;
          MESSAGES.DEFAULT_HEADER.status_code =
            MESSAGES.SUCCESS_REQUEST.status_code;
          MESSAGES.DEFAULT_HEADER.receitas = resultReceitas;

          return MESSAGES.DEFAULT_HEADER;
        } else {
          return MESSAGES.ERROR_NOT_FOUND; //404
        }
      } else {
        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; //500
      }
    } else {
      MESSAGES.ERROR_REQUIRED_FIELDS.message += "[ID incorreto]";
      return MESSAGES.ERROR_REQUIRED_FIELDS; //400
    }
  } catch (error) {
    return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER; //500
  }
};

//insere uma receita
const inserirReceita = async (dadosBody, contentType) => {
  // ... Validação de Content-Type e campos obrigatórios aqui ...

  // --- Lógica de Formatação para a Stored Procedure ---

  // 1. Formatar Categorias: [1, 3]  =>  '1,3'
  const categoriasIdsString = dadosBody.categorias.join(",");

  // 2. Formatar Ingredientes: [{id: 1, qtd: 300, un: 1}, ...]  =>  '1:300:1;2:10:4'
  const ingredientesDadosString = dadosBody.ingredientes
    .map((ing) => {
      return `${ing.id_ingrediente}:${ing.quantidade}:${ing.id_unidade}`;
    })
    .join(";");

  // 3. Montar o Objeto de Parâmetros (incluindo as strings formatadas)
  const dadosParaDAO = {
    ...dadosBody, // Pega todos os campos básicos (titulo, tempo_preparo, id_usuario, etc.)
    categorias_ids: categoriasIdsString, // Novo campo exigido pelo DAO/SP
    ingredientes_dados: ingredientesDadosString, // Novo campo exigido pelo DAO/SP
  };

  try {
    // 4. Chamada ao DAO
    const novoId = await receitaDAO.setInsertRecipes(dadosParaDAO);

    if (novoId) {
      // ... (Lógica para buscar a receita completa, se necessário) ...
      return {
        status_code: 201,
        message: "Receita inserida com sucesso!",
        id: novoId,
      };
    } else {
      return {
        status_code: 500,
        message:
          "Erro ao inserir receita no banco de dados. Verifique os IDs de FKs.",
      };
    }
  } catch (error) {
    // ... (Tratamento de erro) ...
  }
};

const novaReceita = {
  titulo: "Teste Bolo",
  descricao: "Um bolo fácil e rápido.",
  tempo_preparo: "00:40:00",
  passos_preparo: "Misture os secos, adicione os líquidos, asse por 40 min.",
  calorias: 320,
  url_imagem: "http://img.com/bolo.jpg",
  id_usuario: 3,
  id_dificuldade: 1,
  id_tipo_cozinha: 1,
  categorias: [2, 1], // Array de IDs de categorias (Sobremesa, Prato Principal)
  ingredientes: [
    {
      id_ingrediente: 12,
      quantidade: 2,
      id_unidade: 4,
    },
    {
      id_ingrediente: 9,
      quantidade: 1,
      id_unidade: 4,
    },
  ],
};

inserirReceita(novaReceita, "application/json");

//atualiza uma receita buscando pelo id

const atualizarReceita = async (receita, id, contentType) => {
  //criando um objeto novo para as mensagens
  let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

  try {
    //validação do tipo de conteudo da requisição (obrigatorio ser um json)
    if (String(contentType).toUpperCase() == "APPLICATION/JSON") {
      //validação de ID válido, chama a função da controller que verifica no DB se o ID existe e valida o ID
      let validarID = await buscarReceitaId(id);

      if (validarID.status_code == 200) {
        //chama a função para inserir uma nova receita no DB
        let resultReceitas = await receitaDAO.setUpdateRecipes(receita, id);
        if (resultReceitas) {
          MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_UPDATED_ITEM.status;
          MESSAGES.DEFAULT_HEADER.status_code =
            MESSAGES.SUCCESS_UPDATED_ITEM.status_code;
          MESSAGES.DEFAULT_HEADER.message =
            MESSAGES.SUCCESS_UPDATED_ITEM.message;
          MESSAGES.DEFAULT_HEADER.usuario = usuario;
          return MESSAGES.DEFAULT_HEADER; //200
        } else {
          return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; //500
        }
      } else {
        return validarID; //Poderá retornar -> 400, 404 ou 500
      }
    } else {
      return MESSAGES.ERROR_CONTENT_TYPE; //415
    }
  } catch (error) {
    return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER; //500
  }
};

//exclui uma receita buscando pelo id
const excluirReceita = async (id) => {
  //Criando um objeto novo para as mensagens
  let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

  try {
    //Validação da chegada do ID
    if (!isNaN(id) && id != "" && id != null && id > 0) {
      //Validação de ID válido, chama a função da controller que verifica no BD se o ID existe e valida o ID
      let validarID = await buscarReceitaId(id);

      if (validarID.status_code == 200) {
        let resultReceitas = await receitaDAO.setDeleteRecipes(Number(id));

        if (resultReceitas) {
          MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_DELETED_ITEM.status;
          MESSAGES.DEFAULT_HEADER.status_code =
            MESSAGES.SUCCESS_DELETED_ITEM.status_code;
          MESSAGES.DEFAULT_HEADER.message =
            MESSAGES.SUCCESS_DELETED_ITEM.message;
          MESSAGES.DEFAULT_HEADER.receita = resultReceitas;
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
  listarReceitas,
  buscarReceitaId,
  inserirReceita,
  atualizarReceita,
  excluirReceita,
};
