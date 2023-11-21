import PasswordRecoveryService from "../services/PasswordRecovery";
import UserService from "../services/User";
import logger from "../utils/Logger";

const PasswordRecovery = {
  /**
   * Creates a verification code, stores encrypted version in db and sends to email
   * @param {*} req expexts req.userEmail to be set
   * @param {*} res
   */
  async getVCode(req, res) {
    logger.info("received request in /passwordRecovery/getVCode", {
      transactionId: req.transactionId,
      email: req.userEmail,
    });
    try {
      const vCode = await PasswordRecoveryService.generateVCode(req.userEmail);
      await PasswordRecoveryService.sendVCode(req.userEmail, vCode);
      res.status(200).send({ message: "Verification code sent" });
    } catch (error) {
      logger.error("failed to get verification code", {
        error: error.message,
        errorCode: error.code,
        userId: req.user.id,
        transactionId: req.transactionId,
      });
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
    logger.info("received request in /passwordRecovery/changePassword", {
      transactionId: req.transactionId,
      email: req.userEmail,
    });
    try {
      if (!req.body.password) {
        logger.info("no password supplied", {
          transactionId: req.transactionId,
          email: req.userEmail,
        });
        return res.status(403).send({ message: "Please provide new password" });
      }
      if (!req.userEmail || !req.vCodeIsValid) {
        logger.info("user did not provide email or valid vCode", {
          transactionid: req.transactionid,
          email: req.useremail,
        });
        // If they're here likely trying to hack
        return res
          .status(403)
          .send({ message: "Please restart the password recovery process" });
      }

      // Change password
      logger.info("vCode is valid, changing password", {
        transactionId: req.transactionId,
        email: req.userEmail,
      });
      await PasswordRecoveryService.changePassword(
        req.userEmail,
        req.body.password
      );

      // Clean up password_recovery, vCode is no longer needed
      logger.info("password changed, cleaning up vCode", {
        transactionId: req.transactionId,
        email: req.userEmail,
      });
      await PasswordRecoveryService.deleteVCode(req.userEmail);

      // Log user in
      logger.info("logging user in", {
        transactionId: req.transactionId,
        email: req.userEmail,
      });
      const token = await UserService.login(req.userEmail, req.body.password);
      return res.status(200).send({
        message: "Password changed successfully. You are now logged in",
        token,
      });
    } catch (error) {
      logger.error("failed to change password", {
        error: error.message,
        errorCode: error.code,
        userEmail: req.userEmail,
        transactionId: req.transactionId,
      });
      res.status(500).send({ message: error.message });
    }
  },
};

export default PasswordRecovery;
