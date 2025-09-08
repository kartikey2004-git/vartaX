import express from "express"
import { getAllUsers, getUser, loginUser, myProfile, updateName, verifyUser } from "../controllers/userController.js"
import { isAuth } from "../middleware/isAuth.js"

// create router instance
const router = express.Router()


router.post("/login",loginUser)
router.post("/verify-user",verifyUser)
router.get("/me",isAuth,myProfile)
router.get("/user/all",isAuth,getAllUsers)
router.get("/user/:id",getUser)
router.post("/user/update",isAuth,updateName)

export default router