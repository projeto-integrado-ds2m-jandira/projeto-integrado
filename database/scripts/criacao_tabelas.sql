CREATE DATABASE db_projeto_integrado_receitas_ds2m_25_2;

USE db_projeto_integrado_receitas_ds2m_25_2;

CREATE TABLE tb_status (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    situacao VARCHAR(7) NOT NULL
);

CREATE TABLE tb_usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nome VARCHAR(100) NOT NULL,
    genero VARCHAR(20) NOT NULL DEFAULT('Não Informado'),
    email VARCHAR(100) NOT NULL,
    senha VARCHAR(50) NOT NULL,
    administrador BOOLEAN DEFAULT (FALSE) NOT NULL,
    data_criacao DATE NOT NULL,
    id_status INT DEFAULT(1) NOT NULL,


constraint FK_STATUS_USUARIOS 			# Nome da relação
foreign key (id_status)					# Qual a chave estrangeira
references tb_status(id)				# De onde vem a FK
);

CREATE TABLE tb_dificuldades (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nome VARCHAR(50) NOT NULL,
	id_status INT DEFAULT(1) NOT NULL,


constraint FK_STATUS_DIFICULDADES			# Nome da relação
foreign key (id_status)						# Qual a chave estrangeira
references tb_status(id)					# De onde vem a FK
);


CREATE TABLE tb_categorias (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nome VARCHAR(100) NOT NULL,
    id_status INT DEFAULT(1) NOT NULL,


constraint FK_STATUS_CATEGORIAS			# Nome da relação
foreign key (id_status)					# Qual a chave estrangeira
references tb_status(id)				# De onde vem a FK
);

CREATE TABLE tb_tipo_cozinha (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nome VARCHAR(50) NOT NULL,
    id_status INT DEFAULT(1) NOT NULL,


constraint FK_STATUS_TIPO_COZINHA		# Nome da relação
foreign key (id_status)					# Qual a chave estrangeira
references tb_status(id)				# De onde vem a FK
);

CREATE TABLE tb_unidades_medidas (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nome VARCHAR(100) NOT NULL,
    abreviacao VARCHAR(10) NOT NULL,
    id_status INT DEFAULT(1) NOT NULL,


constraint FK_STATUS_UNIDADES_MEDIDAS 	# Nome da relação
foreign key (id_status)					# Qual a chave estrangeira
references tb_status(id)				# De onde vem a FK
);

CREATE TABLE tb_ingredientes (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nome VARCHAR(100) NOT NULL,
    alergeno BOOLEAN DEFAULT (FALSE) NOT NULL,
    tipo VARCHAR (100) NOT NULL,
    id_status INT DEFAULT(1) NOT NULL,


constraint FK_STATUS_INGREDIENTES		# Nome da relação
foreign key (id_status)					# Qual a chave estrangeira
references tb_status(id)				# De onde vem a FK
);



CREATE TABLE tb_receitas(
id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
titulo VARCHAR(100) NOT NULL,
tempo_preparo TIME NOT NULL,
passos_preparo TEXT NOT NULL,
calorias INT NULL,
avaliacao INT NULL,
likes INT NULL,
data_cadastro DATE,
id_usuario int not null,
id_dificuldade int not null,
id_tipo_cozinha int not null,
id_status INT DEFAULT(1) NOT NULL,


constraint FK_STATUS_RECEITAS 			# Nome da relação
foreign key (id_status)					# Qual a chave estrangeira
references tb_status(id),				# De onde vem a FK

constraint FK_USUARIOS_RECEITAS 		# Nome da relação
foreign key (id_usuario)				# Qual a chave estrangeira
references tb_usuarios(id),				# De onde vem a FK

constraint FK_DIFICULDADES_RECEITAS 		# Nome da relação
foreign key (id_dificuldade)				# Qual a chave estrangeira
references tb_dificuldades(id),				# De onde vem a FK

constraint FK_TIPO_COZINHA_RECEITAS 		# Nome da relação
foreign key (id_tipo_cozinha)				# Qual a chave estrangeira
references tb_tipo_cozinha(id)				# De onde vem a FK

);

-- Avaliar se há necessidade de criar as FK Status nas tabelas de relacionamento
CREATE TABLE tb_receitas_categorias(
id 					INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
id_receita		 	int not null,
id_categoria 		int not null,

constraint FK_RECEITA_RECEITAS_CATEGORIAS	 		# Nome da relação
foreign key (id_receita)							# Qual a chave estrangeira
references tb_receitas(id),							# De onde vem a FK

constraint FK_CATEGORIA_RECEITAS_CATEGORIAS			# Nome da relação
foreign key (id_categoria)							# Qual a chave estrangeira
references tb_categorias(id)						# De onde vem a FK

);

CREATE TABLE tb_receitas_ingredientes(
id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
id_receita		 	int not null,
id_ingrediente 		int not null,
id_unidade	 		int not null,
quantidade	 		int not null,



constraint FK_RECEITA_RECEITAS_INGREDIENTES	 			# Nome da relação
foreign key (id_receita)								# Qual a chave estrangeira
references tb_receitas(id),								# De onde vem a FK

constraint FK_INGREDIENTE_RECEITAS_INGREDIENTES	 		# Nome da relação
foreign key (id_ingrediente)							# Qual a chave estrangeira
references tb_ingredientes(id),							# De onde vem a FK

constraint FK_UNIDADE_RECEITAS_INGREDIENTES	 			# Nome da relação
foreign key (id_unidade)								# Qual a chave estrangeira
references tb_unidades_medidas(id)

);


-- Avaliar a criação de tabela de status para poder inativar as demais tabelas sem exclusão