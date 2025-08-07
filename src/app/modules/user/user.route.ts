import { Router } from "express";
import { UserControllers } from "./user.controller";
import auth from "../../middlewares/auth";

const router = Router();

router.post("/", 
    auth("superAdmin"),
    UserControllers.createUser);
    
router.get("/",
    auth("superAdmin"),
    UserControllers.getAllUsers);
    
router.get("/:id", UserControllers.getUserById);

router.patch("/:id",
    auth("superAdmin","companyAdmin", "companyEmployee"),
    UserControllers.updateUser);

router.delete("/:id", UserControllers.deleteUser);

router.patch("/:id/password", UserControllers.changePassword);


export const UserRoutes = router;