import connection from '../database/connection.js';

async function ensureAuth(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const sessionsCheck = await connection.query('SELECT * FROM sessions WHERE token = $1;', [token]);

    if (sessionsCheck.rowCount === 0) {
      return res.sendStatus(404);
    }

    const userId = sessionsCheck.rows[0].user_id;
    const userCheck = await connection.query('SELECT * FROM users WHERE id = $1;', [userId]);

    if (userCheck.rowCount === 0) {
      return res.sendStatus(404);
    }

    return next();
  } catch {
    return res.sendStatus(500);
  }
}

export default ensureAuth;
