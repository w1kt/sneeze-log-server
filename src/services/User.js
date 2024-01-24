import Helpers from "../utils/Helpers";
import uuidv4 from "uuid/v4";
import moment from "moment";
import db from "../db";
import { BadRequestError, NoRecordFoundError } from "../utils/CustomErrors";
import getAccountDeletionEmail from "../email_templates/getAccountDeletionEmail";
import BackupService from "./Backup";

const User = {
  /**
   * Creates a new user in the db with user email and hashed password.
   * Signs a new JWT using user id.
   * @param {string} username
   * @param {string} email
   * @param {string} password
   * @param {number=} level
   * @param {number=} logPoints
   * @returns {string} JWT Token
   */
  async register(username, email, password, level, logPoints) {
    const hashedPassword = Helpers.hashPassword(password);

    let initialLevel = 1;
    let initialLogPoints = 0;

    // handle user leveling without an account, set their initial level
    if (
      typeof level === "number" &&
      typeof logPoints === "number" &&
      level > 1
    ) {
      initialLevel = level;
      initialLogPoints = logPoints;
    }

    const query = `
    INSERT INTO
    users(id, email, password, created_date, modified_date, level, log_points, username)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8)
    returning *
    `;
    const values = [
      uuidv4(),
      email,
      hashedPassword,
      moment(new Date()),
      moment(new Date()),
      initialLevel,
      initialLogPoints,
      username,
    ];

    try {
      const { rows } = await db.query(query, values);
      const token = Helpers.generateToken({ userId: rows[0].id });
      return {
        token,
        userData: {
          username: rows[0].username,
          email: rows[0].email,
          level: rows[0].level,
          logPoints: rows[0].log_points,
          memberSince: rows[0].created_date,
        },
      };
    } catch (error) {
      if (error.routine === "_bt_check_unique") {
        if (error.constraint === "users_email_key") {
          throw new BadRequestError(
            "An account with that email address already exists"
          );
        } else if (error.constraint === "users_username_key") {
          throw new BadRequestError("Username is not available");
        }
      }
      throw error;
    }
  },
  /**
   * Logs user in by checking db for matching email,
   * verifying password and signing a new JWT.
   * @param {string} transactionId
   * @param {string} email
   * @param {string} password
   * @param {number=} level
   * @param {number=} logPoints
   * @returns {string} JWT Token
   */
  async login(email, password, level, logPoints) {
    const query = `
    SELECT * FROM users WHERE email = $1
  `;
    const { rows } = await db.query(query, [email]);
    if (!rows[0]) {
      throw Error(
        "The email address that you've entered doesn't match any account"
      );
    }
    if (!Helpers.comparePassword(rows[0].password, password)) {
      throw new BadRequestError("Incorrect username or password");
    }

    let updatedLevel = rows[0].level;
    let updatedLogPoints = rows[0].log_points;

    // handle user leveling while logged out
    if (
      (typeof level === "number" &&
        typeof logPoints === "number" &&
        level > rows[0].level) ||
      (level === rows[0].level && logPoints > rows[0].log_points)
    ) {
      const updatedLevelData = await this.updateLevel(
        rows[0].id,
        level,
        logPoints
      );
      updatedLevel = updatedLevelData.level;
      updatedLogPoints = updatedLevelData.log_points;
    }

    let lastBackup = null;
    try {
      lastBackup = await BackupService.getModifiedDate(rows[0].id);
    } catch (err) {
      // no op
    }

    const token = Helpers.generateToken({ userId: rows[0].id });
    return {
      token,
      userData: {
        username: rows[0].username,
        email: rows[0].email,
        level: updatedLevel,
        logPoints: updatedLogPoints,
        memberSince: rows[0].created_date,
        lastBackup,
      },
    };
  },
  /**
   * Finds user by ID and removes the account and all associated data.
   * @param {string} id
   */
  async delete(id) {
    try {
      let query = `SELECT email FROM users WHERE id=$1`;
      let { rows } = await db.query(query, [id]);
      if (!rows[0]) {
        throw new NoRecordFoundError("User not found");
      }
      const email = rows[0].email;
      query = `DELETE FROM users WHERE id=$1`;
      await db.query(query, [id]);
      query = `DELETE FROM backup WHERE owner_id=$1`;
      await db.query(query, [id]);
      query = `DELETE FROM password_recovery WHERE email=$1`;
      await db.query(query, [email]);
    } catch (error) {
      throw error;
    }
  },
  /**
   * Gets a users level and accrued log points
   * @param {number} level
   * @param {number} accruedLp
   */
  async getLevelByEmail(email) {
    const query = `SELECT level, log_points FROM users WHERE email=$1`;
    const { rows } = await db.query(query, [email]);
    return rows[0];
  },
  /**
   * Updates a users level and accrued log points
   * @param {number} level
   * @param {number} accruedLp
   */
  async updateLevel(userId, level, logPoints) {
    const query = `UPDATE users SET level=$2, log_points=$3, modified_date=$4 WHERE id=$1 RETURNING level, log_points`;
    const { rows } = await db.query(query, [
      userId,
      level,
      logPoints,
      moment(new Date()),
    ]);
    return rows[0];
  },
  /**
   * Generate a JWT with the users email, send an email with a link to delete the account
   * @param {string} email
   */
  async sendAccountDeletionEmail(email) {
    const query = `
    SELECT * FROM users WHERE email = $1
  `;
    let token = "";
    const { rows } = await db.query(query, [email]);
    if (!rows[0]) {
      throw Error(
        "The email address that you've entered doesn't match any account"
      );
    }
    token = Helpers.generateToken({ userId: rows[0].id }, "1h");
    const apiUrl = `${process.env.API_URL}`;
    try {
      await Helpers.sendEmail(
        email,
        "Account Deletion",
        getAccountDeletionEmail(
          `${apiUrl}/loggable/deleteAccountConfirmed?token=${token}`
        )
      );
    } catch (error) {
      throw new Error("Unable to send account deletion email at this time");
    }
  },
  /**
   * Sets a users username given their id
   * @param {string} id
   * @param {string} username
   */
  async setUsername(id, username) {
    const query = `UPDATE users SET username = $2 WHERE id = $1 RETURNING username`;
    let { rows } = await db.query(query, [id, username]);
    if (!rows[0]) {
      throw new NoRecordFoundError("User not found");
    }
    return rows[0].username;
  },
};

export default User;
