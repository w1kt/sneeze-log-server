import express from "express";
var router = express.Router();
import User from "../controllers/User";
import Auth from "../middleware/Auth";

router.post("/register", User.register);
router.post("/login", User.login);
router.post("/setUsername", Auth.verifyAccountToken, User.setUsername);
router.delete("/deleteUser", Auth.verifyAccountToken, User.delete);
router.get("/sendAccountDeletionEmail", User.sendAccountDeletionEmail);

export default router;
