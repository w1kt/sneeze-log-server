import nodemailer from 'nodemailer';
import randomatic from 'randomatic';
import Helpers from '../utils/Helpers';
import db from '../db';

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
  }
};

export default PasswordRecovery;
