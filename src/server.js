

const app = require('./index'); 
const port = process.env.PORT || 3001; 
const pool = require("./config/database_pg");

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
    pool
    .connect()
    .then(() => {
      console.log("Conexão com o PostgreSQL estabelecida com sucesso!");
    })
    .catch((err) => {
      console.error("Erro ao conectar com o PostgreSQL:", err);
    });
});
