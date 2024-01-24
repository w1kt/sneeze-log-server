/**
 * THIS ROUTE IS DEPRECATED, WILL BE REMOVED ONCE ENOUGH UPGRADE TO NEWEST RN APP
 */
import express from 'express';
import Auth from '../middleware/Auth';
import Community from '../controllers/Community';

var router = express.Router();

router.post('/sync', Auth.verifyAppToken, Community.sync);

export default router;