import nodemailer from 'nodemailer';
import randomatic from 'randomatic';
import Helpers from '../utils/Helpers';
import db from '../db';
import moment from 'moment';

const PasswordRecovery = {
  /**
   * Generates a new verification code, wraps it in a jwt and stores it in the db
   * @param {string} email
   * @returns vCode
   */
  async generateVCode(email) {
    // Generate new verification code
    const vCode = randomatic('A0', 6);

    // Wrap verification code in JWT and store in db
    const vCodeJWT = Helpers.generateToken({ vCode }, '15m');
    try {
      const query = `
      INSERT INTO password_recovery 
        VALUES($1, $2) 
        ON CONFLICT (email) DO UPDATE
          SET vcode_jwt = EXCLUDED.vcode_jwt 
        RETURNING *
      `;
      const { rows } = await db.query(query, [email, vCodeJWT]);
      if (!rows[0]) {
        throw new Error();
      }
      return vCode;
    } catch (error) {
      throw new Error('Could not generate verification token');
    }
  },
  /**
   * Deletes a row in the password_recovery table given a users email address.
   * @param {string} email
   * @returns {boolean} whether the deletion was successful
   */
  deleteVCode(email) {
    try {
      const query = `DELETE FROM password_recovery WHERE email = '${email}'`;
      const { rows } = db.query(query);
      return !!rows.length;
    } catch (error) {
      // Do not re-throw. Failure of this subroutine should interrupt a password change process.
      return false;
    }
  },
  /**
   * Sends verification code to an email address.
   * @param {string} email
   * @param {string} vCode
   */
  async sendVCode(email, vCode) {
    try {
      const auth = {
        type: 'OAuth2',
        user: process.env.EMAIL_CLIENT_ADDRESS,
        clientId: process.env.EMAIL_CLIENT_ID,
        clientSecret: process.env.EMAIL_CLIENT_SECRET,
        refreshToken: process.env.EMAIL_REFRESH_TOKEN
      };
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth
      });
      const mailOpts = {
        from: 'Loggable <noreply@loggable-app.com>',
        to: email,
        subject: 'test',
        text: 'this is a test',
        html: `<p>Your verification code is ${vCode}</p>`
      };
      await transporter.sendMail(mailOpts);
    } catch (error) {
      throw new Error('Unable to send verification code at this time');
    }
  },
  /**
   * Change users password
   * @param {string} email
   * @param {string} password
   * @returns {boolean} whether the update was successful
   */
  async changePassword(email, password) {
    try {
      const hashedPassword = Helpers.hashPassword(password);
      const query = `
        UPDATE users
        SET password = '${hashedPassword}', modified_date = '${moment(
        new Date()
      )}'
        WHERE email = '${email}'
        RETURNING *
      `;
      const { rows } = await db.query(query);
      if (!rows[0]) {
        throw new Error();
      }
      return true;
    } catch (error) {
      throw new Error('Error while trying to update password');
    }
  }
};

export default PasswordRecovery;
