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
router.post("/create-clarhet-user" ,UserControllers.createClarhetUser);
router.get("/clarhet/get-clarhet-user",auth("superAdmin"), UserControllers.getAllClarhetUsers);
router.get("/clarhet/get-clarhet-user/:id",auth("superAdmin"), UserControllers.getSingleClarhetUser);
router.patch("/clarhet/get-clarhet-user/:id",auth("superAdmin"), UserControllers.updateClarhetUser);
router.delete("/clarhet/get-clarhet-user/:id",auth("superAdmin"), UserControllers.deleteClarhetUser);

export const UserRoutes = router;