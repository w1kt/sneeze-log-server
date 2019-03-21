import moment from 'moment';
import uuidv4 from 'uuid/v4';
import db from '../db';
import Helper from './Helper';

const User = {
  /**
   * Create A User
   * @param {object} req
   * @param {object} res
   * @returns {object} reflection object
   */
  async create(req, res) {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({ message: 'Username or password missing' });
    }
    if (!Helper.isValidEmail(req.body.email)) {
      return res
        .status(400)
        .send({ message: 'Please enter a valid email address' });
    }

    const hashedPassword = Helper.hashPassword(req.body.password);

    const query = `
    INSERT INTO
    users(id, email, password, created_date, modified_date)
    VALUES($1, $2, $3, $4, $5)
    returning *
    `;
    const values = [
      uuidv4(),
      req.body.email,
      hashedPassword,
      moment(new Date()),
      moment(new Date())
    ];

    try {
      const { rows } = await db.query(query, values);
      const token = Helper.generateToken(rows[0].id);
      return res.status(201).send({ token });
    } catch (error) {
      if (error.routine === '_bt_check_unique') {
        return res
          .status(400)
          .send({ message: 'A user with that email already exists' });
      }
      return res.status(400).send(error);
    }
  },
  /**
   * Login
   * @param {object} req
   * @param {object} res
   * @returns {object} user object
   */
  async login(req, res) {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({ message: 'Username or password missing' });
    }
    if (!Helper.isValidEmail(req.body.email)) {
      return res
        .status(400)
        .send({ message: 'Please enter a valid email address' });
    }
    const query = `
      SELECT * FROM users WHERE email = $1
    `;
    try {
      const { rows } = await db.query(query, [req.body.email]);
      if (!rows[0]) {
        return res.status(400).send({
          message:
            "The email address that you've entered doesn't match any account"
        });
      }
      if (!Helper.comparePassword(rows[0].password, req.body.password)) {
        return res.status(400).send({ message: 'Incorrect email or password' });
      }
      const token = Helper.generateToken(rows[0].id);
      return res.status(200).send({ token });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  /**
   * Delete A User
   * @param {object} req
   * @param {object} res
   * @returns {void} return status code 204
   */
  async delete(req, res) {
    const query = `DELETE FROM users WHERE id=$1 returning *`;
    try {
      const { rows } = await db.query(query, [req.user.id]);
      if (!rows[0]) {
        return res.status(404).send({ message: 'User not found' });
      }
      return res.status(204).send({ message: 'User deleted' });
    } catch (error) {
      return res.status(400).send(error);
    }
  }
};

export default User;
