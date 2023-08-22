const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const sqliteConnection = require("../database/sqlite");
const usersRoutes = require("../routes/users.routes");

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body;

    const database = await sqliteConnection();

    const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

    if (checkUserExists) {
      const error = new AppError("Email já cadastrado", 403);
      return response.status(403).json(error);
    }

    const hashedPassword = await hash(password, 8);

    await database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);

    return response.status(201).json();

  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body;
    const user_id = request.user.id;

    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);

    if (!user) {
      const error = new AppError("Usuário não existe");
      return response.status(400).json(error);
    }

    const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);
    if (userWithUpdatedEmail && userWithUpdatedEmail.id != user.id) {
      const error = new AppError("Este email já existe");
      return response.status(400).json(error);
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (password && !old_password) {
      const error = new AppError("Você precisa informar a senha antiga para definir a nova senha");
      return response.status(400).json(error);
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        return response.status(400).json(new AppError("A senha que você informou está errada"));
      }

      user.password = await hash(password, 8);
    }

    await database.run(`
      UPDATE users SET 
      name = ?,
      email = ?,
      password = ?,
      updated_at = DATETIME('now')
      WHERE id = ?
      `,
      [user.name, user.email, user.password, user_id]
    );

    return response.status(200).json();

  }
}

module.exports = UsersController;