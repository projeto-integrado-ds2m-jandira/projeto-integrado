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