/**
 * Routes exposed are intented to be publicly hosted/displayed
 * /api/v1 should not be prefixed before these routes.
 */

import express from 'express';
var router = express.Router();
import User from '../controllers/User';
import Auth from '../middleware/Auth';
import Public from "../services/Public";

router.get('/deleteAccount', (req, res) => {
  res.send(Public.getDeleteAccountPage());
});
router.get('/deleteAccountConfirmed', async (req, res) => {
  const token = req.query.token;
  if (!token) {
    res.send("An error has occurred");
  } else {
    try {
      res.send(await Public.getDeleteAccountConfirmedPage(token));
    } catch (error) {
      res.send("An error has occurred");
    }
  }
});

export default router