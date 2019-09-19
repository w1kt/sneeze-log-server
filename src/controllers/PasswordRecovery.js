import PasswordRecoveryService from '../services/PasswordRecovery';

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
};

export default PasswordRecovery;
