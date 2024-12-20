const jwt = require("jsonwebtoken")

const auth = (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      return res
        .status(401)
        .json({ msg: "Autorização negada. Não existe token de acesso." })
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET)
    if (!verified) {
      return res
        .status(401)
        .json({ msg: "Autorização negada. A verificação do token de acesso falhou." })
    }

    req.user = verified

    next()
    
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = auth
