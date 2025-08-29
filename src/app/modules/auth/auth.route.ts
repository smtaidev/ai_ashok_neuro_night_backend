import express from "express";
import { AuthController } from "./auth.controller";
const router = express.Router();

router.post("/login", AuthController.loginUser);
router.post("/organization-login", AuthController.organizationUser);
router.post("/clarhet-login", AuthController.clarhetUserLogin);
// router.post("/forget-password", AuthController.refreshToken);


export const AuthRoutes = router;