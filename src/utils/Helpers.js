import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
  }
};

export default Helpers;
