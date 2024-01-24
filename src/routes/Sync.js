import express from "express";
import Auth from "../middleware/Auth";
import Sync from "../controllers/Sync";

var router = express.Router();

router.post("/guest", Auth.verifyAppToken, Sync.guest);
router.post(
  "/member",
  Auth.verifyAppToken,
  Auth.verifyAccountToken,
  Sync.member
);

export default router;
