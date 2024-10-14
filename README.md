# User Registration Application

Este é um projeto Node.js básico que se conecta a um banco de dados PostgreSQL.

## Instalação

1. Certifique-se de ter o Node.js e o npm instalados em sua máquina.
2. Clone este repositório para o seu ambiente local.
3. No diretório do projeto, execute o seguinte comando para instalar as dependências:

```npm install```


4. Configure o PostgreSQL e certifique-se de ter um banco de dados criado para o projeto.

## Configuração

Antes de executar o projeto, é necessário configurar algumas variáveis de ambiente para a conexão com o banco de dados PostgreSQL. Crie o arquivo `.env` e insira as informações de conexão corretas:

```
DB_USER=seu_usuario
DB_HOST=seu_host
DB_NAME=seu_banco_de_dados
DB_PASS=sua_senha
DB_PORT=sua_porta
```

## Uso

Após a instalação e configuração, você pode executar o projeto usando o seguinte comando:

```
npm start
npm run dev
```


Isso iniciará o servidor Node.js e você poderá acessá-lo em `http://localhost:3001`.

## Tecnologias Utilizadas

- Node.js: [https://nodejs.org/](https://nodejs.org/)
- PostgreSQL: [https://www.postgresql.org/](https://www.postgresql.org/)




