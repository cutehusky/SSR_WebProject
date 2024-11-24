import express from "express";
import {UserController} from "../Controllers/UserController";


const router = express.Router();

const userController = new UserController();

router.get('/login', userController.logIn);
router.get('/register', userController.register);
router.get('/forgot-password', userController.forgotPassword);
router.get('/profile', userController.getUserProfile);

export {router as UserRouter}