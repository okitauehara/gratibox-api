/* eslint-disable camelcase */
import connection from '../database/connection.js';
import signatureSchema from '../schemas/signatureSchema.js';

async function postSignature(req, res) {
  const {
    delivery_date, products, cep, number, full_name,
  } = req.body;
  const { planId } = req.params;
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const { error } = signatureSchema.validate({
      delivery_date, products, cep, number, full_name,
    });

    if (error) {
      return res.status(400).send(error);
    }

    const getSession = await connection.query('SELECT * FROM sessions WHERE token = $1', [token]);
    if (getSession.rowCount === 0) {
      return res.sendStatus(404);
    }
    const session = getSession.rows[0];

    const getUser = await connection.query('SELECT * FROM users WHERE id = $1', [session.user_id]);
    const user = getUser.rows[0];

    products.forEach(async (product) => {
      await connection.query(`
      INSERT INTO users_products
        (user_id, product_id)
      VALUES
        ($1, $2)`, [user.id, Number(product)]);
    });

    const getDate = await connection.query('SELECT * FROM dates WHERE date = $1', [delivery_date]);
    const dateId = getDate.rows[0].id;

    await connection.query(`
    INSERT INTO delivery_infos
      (cep, number, date_id, full_name)
    VALUES
      ($1, $2, $3, $4)`, [cep, number, dateId, full_name]);

    const getDeliveryInfos = await connection.query(`
    SELECT * FROM delivery_infos
      WHERE cep = $1
        AND number = $2
        AND date_id = $3
        AND full_name = $4`, [cep, number, dateId, full_name]);
    const deliveryInfosId = getDeliveryInfos.rows[0].id;

    const signatureDate = new Date();

    await connection.query('UPDATE users SET plan_id = $1 WHERE id = $2', [planId, user.id]);
    await connection.query(`
    INSERT INTO signatures
      (user_id, plan_id, delivery_id, signature_date)
    VALUES
      ($1, $2, $3, $4)`, [user.id, planId, deliveryInfosId, signatureDate]);

    return res.status(201).send({
      name: user.name,
      planId: Number(planId),
      token,
    });
  } catch {
    return res.status(500).send({
      message: 'Não foi possível assinar o plano.',
    });
  }
}

async function getSignatures(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const getSession = await connection.query('SELECT * FROM sessions WHERE token = $1', [token]);
    if (getSession.rowCount === 0) {
      return res.sendStatus(404);
    }
    const session = getSession.rows[0];

    const getUser = await connection.query('SELECT * FROM users WHERE id = $1', [session.user_id]);
    const user = getUser.rows[0];

    const getPlan = await connection.query('SELECT * FROM plans WHERE id = $1', [user.plan_id]);
    const plan = getPlan.rows[0].name;

    const result = await connection.query(`
      SELECT
        signatures.signature_date,
        users_products.product_id,
        dates.date
      FROM signatures
      JOIN users_products
        ON users_products.user_id = $1
      JOIN delivery_infos
        ON delivery_infos.id = delivery_id
      JOIN dates
        ON dates.id = delivery_infos.date_id
      WHERE signatures.user_id = $1
    `, [user.id]);
    const signature = {
      signature_date: result.rows[0].signature_date,
      products: result.rows.map((value) => value.product_id),
      plan,
      delivery_date: result.rows[0].date,
    };
    return res.status(200).send(signature);
  } catch {
    return res.status(500).send({
      message: 'Não foi possível retornar as informações do plano',
    });
  }
}

export {
  postSignature,
  getSignatures,
};
