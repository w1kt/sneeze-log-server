import PasswordRecoveryService from '../services/PasswordRecovery';
import UserService from '../services/User';

const PasswordRecovery = {
  /**
   * Creates a verification code, stores encrypted version in db and sends to email
   * @param {*} req expexts req.userEmail to be set
   * @param {*} res
   */
  async getVCode(req, res) {
    try {
      const vCode = await PasswordRecoveryService.generateVCode(req.userEmail);
      await PasswordRecoveryService.sendVCode(req.userEmail, vCode);
      res.status(200).send({ message: 'Verification code sent' });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },
  /**
   * Changes user password and logs them in with their new credentials.
   * Should only ever be invoked after checkEmailExists and verifyVCode middlewares.
   * @param {*} req expects req.userEmail and req.vCode to be set
   * @param {*} res
   */
  async changePassword(req, res) {
    try {
      if (!req.body.password) {
        return res.status(403).send({ message: 'Please provide new password' });
      }
      if (!req.userEmail || !req.vCodeIsValid) {
        // If they're here likely trying to hack
        return res
          .status(403)
          .send({ message: 'Please restart the password recovery process' });
      }

      // Change password
      await PasswordRecoveryService.changePassword(
        req.userEmail,
        req.body.password
      );

      // Clean up password_recovery, vCode is no longer needed
      await PasswordRecoveryService.deleteVCode(req.userEmail);
      
      // Log user in
      const token = await UserService.login(req.userEmail, req.body.password);
      return res
        .status(200)
        .send({
          message: 'Password changed successfully. You are now logged in',
          token
        });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
};

export default PasswordRecovery;
