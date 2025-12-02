USE db_projeto_integrado_receitas_ds2m_25_2;

select * from tb_status;
select * from tb_receitas;
select * from tb_usuarios;
select * from tb_categorias;
select * from tb_dificuldades;
select * from tb_receitas_categorias;
select * from tb_receitas_ingredientes;
select * from tb_tipo_cozinha;
select * from tb_unidades_medidas;
select * from tb_ingredientes;

-- select id, nome, genero, email, senha, administrador, url_imagem, id_status, date_format(data_criacao, '%d/%m/%Y') as data_criacao from tb_usuarios where id= 6;

DELIMITER //

CREATE PROCEDURE sp_criar_receita (
    IN p_titulo VARCHAR(100),
    IN p_descricao VARCHAR(1000),
    IN p_tempo_preparo TIME,
    IN p_passos_preparo TEXT,
    IN p_calorias INT,
    IN p_avaliacao INT,
    IN p_likes INT,
    IN p_url_imagem VARCHAR(250),
    IN p_id_usuario INT,
    IN p_id_dificuldade INT,
    IN p_id_tipo_cozinha INT,
    IN p_categorias_ids VARCHAR(1000), -- IDs de categorias separados por vírgula (ex: '1,5,10')
    IN p_ingredientes_dados TEXT 		 -- Dados de ingredientes formatados (ex: '1:250:3;2:10:4')
)
BEGIN
    DECLARE v_id_receita INT;
    DECLARE v_categoria_id INT;
    DECLARE v_ingrediente_id INT;
    DECLARE v_unidade_id INT;
    DECLARE v_quantidade INT;
    DECLARE v_delimiter_categorias CHAR(1) DEFAULT ',';
    DECLARE v_delimiter_ingredientes CHAR(1) DEFAULT ';';
    DECLARE v_delimiter_dados CHAR(1) DEFAULT ':';
    DECLARE v_temp_categoria VARCHAR(100);
    DECLARE v_temp_ingrediente VARCHAR(100);
    DECLARE v_pos_cat INT DEFAULT 1;
    DECLARE v_pos_ing INT DEFAULT 1;

    -- 1. Inserir na tabela tb_receitas
    INSERT INTO tb_receitas (
        titulo,
        descricao,
        tempo_preparo,
        passos_preparo,
        calorias,
        avaliacao,
        likes,
        url_imagem,
        data_cadastro,
        id_usuario,
        id_dificuldade,
        id_tipo_cozinha,
        id_status
    )
    VALUES (
        p_titulo,
        p_descricao,
        p_tempo_preparo,
        p_passos_preparo,
        p_calorias,
        p_avaliacao,
        p_likes,
        p_url_imagem,
        CURDATE(), -- Usa a data atual
        p_id_usuario,
        p_id_dificuldade,
        p_id_tipo_cozinha,
        1 -- id_status padrão
    );

    -- Obter o ID da receita recém-criada
    SET v_id_receita = LAST_INSERT_ID();

    -- 2. Inserir na tabela tb_receitas_categorias
    -- Loop para processar os IDs de categorias separados por vírgula
    WHILE LENGTH(p_categorias_ids) > 0 DO
        SET v_pos_cat = LOCATE(v_delimiter_categorias, p_categorias_ids);

        IF v_pos_cat = 0 THEN
            SET v_temp_categoria = p_categorias_ids;
            SET p_categorias_ids = '';
        ELSE
            SET v_temp_categoria = SUBSTRING(p_categorias_ids, 1, v_pos_cat - 1);
            SET p_categorias_ids = SUBSTRING(p_categorias_ids, v_pos_cat + 1);
        END IF;

        SET v_categoria_id = TRIM(v_temp_categoria);

        IF v_categoria_id IS NOT NULL AND v_categoria_id > 0 THEN
            INSERT INTO tb_receitas_categorias (id_receita, id_categoria)
            VALUES (v_id_receita, v_categoria_id);
        END IF;
    END WHILE;

    -- 3. Inserir na tabela tb_receitas_ingredientes
    -- Loop para processar os dados de ingredientes separados por ponto e vírgula
    WHILE LENGTH(p_ingredientes_dados) > 0 DO
        SET v_pos_ing = LOCATE(v_delimiter_ingredientes, p_ingredientes_dados);

        IF v_pos_ing = 0 THEN
            SET v_temp_ingrediente = p_ingredientes_dados;
            SET p_ingredientes_dados = '';
        ELSE
            SET v_temp_ingrediente = SUBSTRING(p_ingredientes_dados, 1, v_pos_ing - 1);
            SET p_ingredientes_dados = SUBSTRING(p_ingredientes_dados, v_pos_ing + 1);
        END IF;

        -- Extrair os 3 valores (id_ingrediente:quantidade:id_unidade) separados por dois pontos
        SET v_ingrediente_id = SUBSTRING_INDEX(v_temp_ingrediente, v_delimiter_dados, 1);
        SET v_quantidade = SUBSTRING_INDEX(SUBSTRING_INDEX(v_temp_ingrediente, v_delimiter_dados, 2), v_delimiter_dados, -1);
        SET v_unidade_id = SUBSTRING_INDEX(v_temp_ingrediente, v_delimiter_dados, -1);

        IF v_ingrediente_id IS NOT NULL AND v_ingrediente_id > 0 AND v_unidade_id IS NOT NULL AND v_unidade_id > 0 THEN
            INSERT INTO tb_receitas_ingredientes (id_receita, id_ingrediente, id_unidade, quantidade)
            VALUES (v_id_receita, v_ingrediente_id, v_unidade_id, v_quantidade);
        END IF;
    END WHILE;
    
    -- Retorna o ID da nova receita (opcional, mas útil)
    SELECT v_id_receita AS id_nova_receita;

END //

DELIMITER ;


CALL sp_criar_receita (
    'Bolo de Cenoura Turbinado', 		-- p_titulo
    'Um delicioso bolo de cenoura com cobertura especial.', -- p_descricao
    '00:45:00', 						-- p_tempo_preparo (HH:MM:SS)
    'Misture os ingredientes secos, adicione os líquidos, asse por 45 minutos e finalize com a cobertura.', -- p_passos_preparo
    450, 								-- p_calorias
    5, 									-- p_avaliacao
    120, 								-- p_likes
    'https://exemplo.com/bolocenoura.jpg', -- p_url_imagem
    1, 									-- p_id_usuario (ID do usuário que cadastrou)
    2, 									-- p_id_dificuldade (Ex: 2 = Média)
    1, 									-- p_id_tipo_cozinha (Ex: 1 = Brasileira)
    '1, 3', 							-- p_categorias_ids (Ex: 1=Sobremesa, 3=Bolo)
    '5:300:1; 10:4:2; 15:1:5' 			-- p_ingredientes_dados (Ingrediente 5: 300g, Ingrediente 10: 4 unidades, Ingrediente 15: 1 xícara)
);


CALL sp_criar_receita (
    'Bolo Simples de Chocolate', 				-- p_titulo
    'Um bolo de chocolate fácil e rápido, ideal para o café da tarde.', -- p_descricao
    '00:40:00', 								-- p_tempo_preparo (40 minutos)
    'Misture os secos, adicione os líquidos (ovos e leite não listados) e a manteiga. Asse por 40 min em forno médio.', -- p_passos_preparo
    320, 										-- p_calorias
    NULL, 										-- p_avaliacao (NULL no cadastro)
    0, 											-- p_likes (0 no cadastro)
    NULL, 										-- p_url_imagem
    3, 											-- p_id_usuario: Carlos Eduardo
    1, 											-- p_id_dificuldade: Fácil
    1, 											-- p_id_tipo_cozinha: Brasileira
    '2', 										-- p_categorias_ids: 2 (Sobremesa)
    '12:2:4; 9:1:4; 10:2:3' 					-- p_ingredientes_dados: Farinha(2:4); Chocolate(1:4); Manteiga(2:3)
);