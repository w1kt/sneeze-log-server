import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const Helpers = {
  /**
   * Hash Password Method
   * @param {string} password
   * @returns {string} returns hashed password
   */
  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  },
  /**
   * comparePassword
   * @param {string} hashPassword
   * @param {string} password
   * @returns {Boolean} return True or False
   */
  comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  },
  /**
   * isValidEmail helper method
   * @param {string} email
   * @returns {Boolean} True or False
   */
  isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  },
  /**
   * Generate Token
   * @param {object} contents
   * @returns {string} token
   */
  generateToken(contents, expiresIn) {
    const opts = expiresIn ? { expiresIn } : {};
    const token = jwt.sign(
      { ...contents },
      process.env.ACCOUNT_SECRET,
      /** TODO: implement short expiry along with OAuth2 style refresh token.
       * This piece of work is precluded by a means (web client?) of revoking refresh tokens.
       **/
      { ...opts }
    );
    return token;
  },
  /**
   * Sends an email
   * @param {string} email 
   * @param {string} subject
   * @param {{ text: string, html: string }} emailContent 
   */
  async sendEmail(email, subject, emailContent) {
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
      subject,
      text: emailContent.text,
      html: emailContent.html
    };
    await transporter.sendMail(mailOpts);
  }
};

export default Helpers;
