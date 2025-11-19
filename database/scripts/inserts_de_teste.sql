INSERT INTO tb_status (situacao) VALUES
('Ativo'),
('Inativo');

INSERT INTO tb_dificuldades (nome) VALUES
('Fácil'),
('Média'),
('Difícil');

INSERT INTO tb_tipo_cozinha (nome) VALUES
('Brasileira'),
('Italiana'),
('Mexicana');

INSERT INTO tb_unidades_medidas (nome, abreviacao) VALUES
('Grama', 'g'),
('Mililitro', 'ml'),
('Colher de Sopa', 'CS'),
('Xícara', 'xc'),
('Unidade', 'un');

INSERT INTO tb_ingredientes (nome, alergeno, tipo) VALUES
('Massa de Lasanha', FALSE, 'Carboidrato'), -- ID 1
('Carne Moída', FALSE, 'Proteína'), -- ID 2
('Molho de Tomate', FALSE, 'Molho'), -- ID 3
('Queijo Muçarela', TRUE, 'Laticínio'), -- ID 4 (Alergeno: Leite)
('Pimenta Dedo-de-Moça', FALSE, 'Especiaria'), -- ID 5
('Azeite de Oliva', FALSE, 'Gordura'), -- ID 6
('Tomate', FALSE, 'Vegetal'), -- ID 7
('Cebola', FALSE, 'Vegetal'), -- ID 8
('Chocolate em Pó', FALSE, 'Doce'), -- ID 9
('Manteiga', TRUE, 'Laticínio'), -- ID 10 (Alergeno: Leite)
('Leite Condensado', TRUE, 'Laticínio'), -- ID 11 (Alergeno: Leite)
('Farinha de Trigo', TRUE, 'Carboidrato'); -- ID 12 (Alergeno: Glúten)

INSERT INTO tb_categorias (nome) VALUES
('Prato Principal'),
('Sobremesa'),
('Vegana'),
('Lanche');

INSERT INTO tb_usuarios (nome, genero, email, senha, data_criacao) VALUES
('Ana Paula Silva', 'Feminino', 'ana.silva@email.com', 'senha123', '2024-01-15'), -- ID 1
('Bruno Costa', 'Masculino', 'bruno.costa@email.com', 'bruno456', '2024-02-20'), -- ID 2
('Carlos Eduardo', 'Masculino', 'carlos.edu@email.com', 'carlitos', '2023-11-10'), -- ID 3
('Diana Mendes', 'Feminino', 'diana.mendes@email.com', 'diana789', '2024-03-01'), -- ID 4
('Elias Ferreira', 'Não Informado', 'elias.ferreira@email.com', 'elias2024', '2024-04-05'); -- ID 5

INSERT INTO tb_receitas (titulo, tempo_preparo, passos_preparo, calorias, avaliacao, likes, data_cadastro, id_usuario, id_dificuldade, id_tipo_cozinha) VALUES
('Lasanha à Bolonhesa Clássica', '00:45:00', 'Cozinhe a massa. Prepare o molho bolonhesa. Monte as camadas alternando massa, molho e queijo. Leve ao forno.', 500, 5, 120, '2024-05-10', 1, 2, 2);

INSERT INTO tb_receitas (titulo, tempo_preparo, passos_preparo, calorias, avaliacao, likes, data_cadastro, id_usuario, id_dificuldade, id_tipo_cozinha) VALUES
('Chilli Mexicano Apimentado', '01:30:00', 'Refogue a carne com alho e cebola. Adicione o molho de tomate, pimentas e temperos. Cozinhe em fogo baixo até engrossar.', 350, 4, 85, '2024-05-15', 2, 3, 3);

INSERT INTO tb_receitas (titulo, tempo_preparo, passos_preparo, calorias, avaliacao, likes, data_cadastro, id_usuario, id_dificuldade, id_tipo_cozinha) VALUES
('Brigadeiro de Panela Rápido', '00:15:00', 'Misture todos os ingredientes na panela e leve ao fogo baixo, mexendo sempre até desgrudar do fundo. Sirva quente ou frio.', 280, 5, 250, '2024-06-01', 4, 1, 1);

-- Lasanha à Bolonhesa (ID 1) é Prato Principal (ID 1)
INSERT INTO tb_receitas_categorias (id_receita, id_categoria) VALUES
(1, 1);

-- Chilli Mexicano (ID 2) é Prato Principal (ID 1)
INSERT INTO tb_receitas_categorias (id_receita, id_categoria) VALUES
(2, 1);

-- Brigadeiro (ID 3) é Sobremesa (ID 2)
INSERT INTO tb_receitas_categorias (id_receita, id_categoria) VALUES
(3, 2);

INSERT INTO tb_receitas_ingredientes (id_receita, id_ingrediente, id_unidade, quantidade) VALUES
-- Lasanha à Bolonhesa (ID 1)
(1, 1, 5, 1),  -- Massa de Lasanha (1 un)
(1, 2, 1, 400), -- Carne Moída (400 g)
(1, 3, 2, 500), -- Molho de Tomate (500 ml)
(1, 4, 1, 300), -- Queijo Muçarela (300 g)

-- Chilli Mexicano Apimentado (ID 2)
(2, 2, 1, 500),  -- Carne Moída (500 g)
(2, 8, 5, 1),   -- Cebola (1 un)
(2, 5, 5, 2),   -- Pimenta Dedo-de-Moça (2 un)
(2, 6, 3, 2),   -- Azeite de Oliva (2 CS)

-- Brigadeiro de Panela Rápido (ID 3)
(3, 11, 5, 1), -- Leite Condensado (1 un)
(3, 9, 3, 4),  -- Chocolate em Pó (4 CS)
(3, 10, 3, 1); -- Manteiga (1 CS)

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