const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const { compare } = require("bcryptjs");
const authConfig = require("../configs/auth");
const { sign } = require("jsonwebtoken");

class SessionsController {
  async create(request, response) {
    const { email, password } = request.body;

    const user = await knex("users").where({ email }).first();

    // Conferir se o usuário existe
    if (!user) {
      const error = new AppError("E-mail ou senha incorretos");
      return response.status(401).json(error);
    }

    const passwordMatched = await compare(password, user.password);

    // Conferir se a senha está certa
    if (!passwordMatched) {
      const error = new AppError("E-mail ou senha incorretos");
      return response.status(401).json(error);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn
    });

    return response.json({ user, token });
  }
}

module.exports = SessionsController;

