import Helpers from "../utils/Helpers";
import uuidv4 from "uuid/v4";
import moment from "moment";
import db from "../db";
import { NoRecordFoundError } from "../utils/CustomErrors";

const User = {
  /**
   * Creates a new user in the db with user email and hashed password.
   * Signs a new JWT using user id.
   * @param {string} email
   * @param {string} password
   * @returns {string} JWT Token
   */
  async register(email, password) {
    const hashedPassword = Helpers.hashPassword(password);

    const query = `
    INSERT INTO
    users(id, email, password, created_date, modified_date)
    VALUES($1, $2, $3, $4, $5)
    returning *
    `;
    const values = [
      uuidv4(),
      email,
      hashedPassword,
      moment(new Date()),
      moment(new Date())
    ];

    try {
      const { rows } = await db.query(query, values);
      const token = Helpers.generateToken(rows[0].id);
      return token;
    } catch (error) {
      if (error.routine === "_bt_check_unique") {
        throw Error("A user with that email already exists");
      }
      throw error;
    }
  },
  /**
   * Logs user in by checking db for matching email, 
   * verifying password and signing a new JWT.
   * @param {string} email 
   * @param {string} password 
   * @returns {string} JWT Token
   */
  async login(email, password) {
    const query = `
    SELECT * FROM users WHERE email = $1
  `;
    try {
      const { rows } = await db.query(query, [email]);
      if (!rows[0]) {
        throw Error(
          "The email address that you've entered doesn't match any account"
        );
      }
      if (!Helpers.comparePassword(rows[0].password, password)) {
        throw Error("Incorrect email or password");
      }
      const token = Helpers.generateToken(rows[0].id);
      return token;
    } catch (error) {
      throw Error(error);
    }
  },
  /**
   * Finds user by ID and removes the account and all associated data.
   * @param {string} id 
   */
  async delete(id) {
    const query = `DELETE FROM users WHERE id=$1 returning *`;
    try {
      const { rows } = await db.query(query, [id]);
      if (!rows[0]) {
        throw new NoRecordFoundError("User not found");
      }
    } catch (error) {
      throw error;
    }
  }
};

export default User;
