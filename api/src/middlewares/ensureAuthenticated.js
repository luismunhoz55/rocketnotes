const { verify } = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const authConfig = require("../configs/auth");

function ensureAuthenticated(request, response, next) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    const error = new AppError("JWT Token não informado");
    return response.status(401).json(error);
  }

  const [, token] = authHeader.split(" ");

  try {
    const { sub: user_id } = verify(token, authConfig.jwt.secret);

    request.user = {
      id: Number(user_id)
    }

    return next();
  } catch {
    const error = new AppError("JWT Token inválido");
    return response.status(401).json(error);
  }

}

module.exports = ensureAuthenticated;