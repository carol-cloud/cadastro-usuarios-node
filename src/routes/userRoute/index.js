const express = require("express");
const pool = require("../../config/database_pg");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");

const router = express.Router();

router.post("/verify-token", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);

    const query = 'SELECT * FROM usuarios WHERE id_colaborador = $1';
    const result = await pool.query(query, [verified.id]);
    const user = result.rows[0];

    if (!user) return res.json(false);

    return res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/usuarios", auth, async (req, res) => {
  try {
    const query = "SELECT id, nome_usuario AS nome, email FROM usuarios";
    const result = await pool.query(query);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Erro no servidor." });
  }
});

router.get("/usuario", auth, async (req, res) => {
  try {
  
    const userId = req.user.userId;

    const query = `
        SELECT id, nome_usuario, email, role  
        FROM usuarios 
        WHERE id = $1
      `;
    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Erro no servidor." });
  }
});

router.post(
  "/cadastro",
  [
    body("nome_usuario")
      .isLength({ min: 3 })
      .withMessage("Nome de usuário deve ter pelo menos 3 caracteres."),
    body("email").isEmail().withMessage("Email inválido."),
    body("senha")
      .isLength({ min: 6 })
      .withMessage("Senha deve ter pelo menos 6 caracteres."),
    body("role")
      .optional()
      .isIn(["administrador", "editor", "visualizador"])
      .withMessage("Role inválido. Deve ser 'administrador', 'editor' ou 'visualizador'."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nome_usuario, email, senha, role = "visualizador" } = req.body;

    try {
      const userCheck = await pool.query(
        "SELECT * FROM usuarios WHERE nome_usuario = $1 OR email = $2",
        [nome_usuario, email]
      );

      if (userCheck.rows.length > 0) {
        return res
          .status(400)
          .json({ error: "Nome de usuário ou email já estão em uso." });
      }

      const hashedPassword = await bcrypt.hash(senha, 10);

      const newUser = await pool.query(
        "INSERT INTO usuarios (nome_usuario, email, senha, role) VALUES ($1, $2, $3, $4) RETURNING id, nome_usuario, email, role",
        [nome_usuario, email, hashedPassword, role]
      );

      res.status(201).json(newUser.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Erro no servidor." });
    }
  }
);

router.delete("/usuario/:id", auth, async (req, res) => {
  try {
    const userId = req.params.id; 

    if (!userId) {
      return res.status(400).json({ error: "ID do usuário não fornecido." });
    }

    const query = "DELETE FROM usuarios WHERE id = $1";
    const result = await pool.query(query, [userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    res.status(200).json({ message: "Usuário excluído com sucesso." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Erro no servidor." });
  }
});


router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email inválido."),
    body("senha").notEmpty().withMessage("Senha é obrigatória."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, senha } = req.body;

    try {
      const userResult = await pool.query(
        "SELECT * FROM usuarios WHERE email = $1",
        [email]
      );
      if (userResult.rows.length === 0) {
        return res.status(400).json({ error: "Email ou senha incorretos." });
      }

      const user = userResult.rows[0];

      const isMatch = await bcrypt.compare(senha, user.senha);
      if (!isMatch) {
        return res.status(400).json({ error: "Email ou senha incorretos." });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({ token });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Erro no servidor." });
    }
  }
);

router.put('/usuario/:id', auth, async (req, res) => {
  try {
    const { id, nome, email, senha } = req.body; 

    if (!nome || !email || !senha ) {
      return res.status(400).json({ error: 'Nome, email ou senha são obrigatórios.' });
    }

    const query = `
      UPDATE usuarios 
      SET nome_usuario = $1, email = $2, senha = $3
      WHERE id = $4 
      RETURNING id, nome_usuario AS nome, email, role
    `;
    const result = await pool.query(query, [nome, email, senha, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const updatedUser = result.rows[0];
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro no servidor.' });
  }
});


module.exports = router;
