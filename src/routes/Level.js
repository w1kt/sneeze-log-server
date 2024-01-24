import express from "express";
import Auth from "../middleware/Auth";
import Level from "../controllers/Level";

var router = express.Router();

router.get("/data", Auth.verifyAppToken, Level.data);

export default router;
