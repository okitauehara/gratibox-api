import bcrypt from 'bcrypt';
import connection from '../database/connection.js';
import signUpSchema from '../schemas/signUpSchema.js';

async function postUser(req, res) {
  const { name, email, password } = req.body;

  try {
    const { error } = signUpSchema.validate({ name, email, password });

    if (error) {
      return res.status(400).send(error);
    }

    const result = await connection.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rowCount > 0) {
      return res.sendStatus(409);
    }
    const passwordHash = bcrypt.hashSync(password, 10);

    await connection.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, passwordHash]);
    return res.sendStatus(201);
  } catch {
    return res.status(500).send({
      message: 'Não foi possível cadastrar o usuário.',
    });
  }
}

export default postUser;
