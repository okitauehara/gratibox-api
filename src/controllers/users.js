import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import connection from '../database/connection.js';
import signUpSchema from '../schemas/signUpSchema.js';

async function postSignUp(req, res) {
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

async function postSignIn(req, res) {
  const { email, password } = req.body;

  try {
    const emailCheck = await connection.query('SELECT * from users WHERE email = $1;', [email]);
    if (emailCheck.rowCount === 0) {
      return res.sendStatus(401);
    }

    const user = emailCheck.rows[0];

    const passwordCheck = bcrypt.compareSync(password, user.password);
    if (!passwordCheck) {
      return res.sendStatus(401);
    }

    const token = uuid();

    await connection.query(`
      INSERT INTO sessions
        (users_id, token)
      VALUES
        ($1, $2)
    ;`, [user.id, token]);

    return res.status(200).send({
      token,
    });
  } catch {
    return res.status(500).send({
      message: 'Não foi possível logar o usuário.',
    });
  }
}

export {
  postSignUp,
  postSignIn,
};
