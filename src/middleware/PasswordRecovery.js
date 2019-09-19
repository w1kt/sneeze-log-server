import db from '../db';

const PasswordRecovery = {
  /**
   * Checks that the given email exists in the Users table
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object|void} response object
   */
  async checkEmailExists(req, res, next) {
    if (!req.body.email) {
      return res.status(403).send({ message: 'Email is not provided' });
    }
    const email = req.body.email.trim().toLowerCase();
    try {
      const query = `SELECT * FROM users WHERE email = '${email}'`;
      const { rows } = await db.query(query);
      if (!rows[0]) {
        return res.status(404).send({ message: 'There is no account associated with that email address' });
      }
      req.userEmail = email;
      next();
    } catch (error) {
      return res.status(400).send(error);
    }
  }
};

export default PasswordRecovery;
