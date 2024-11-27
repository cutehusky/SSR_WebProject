import express from "express";
import { GuestController } from "../Controllers/GuestController";

const router = express.Router();

const guestController = new GuestController();

router.get("/search", guestController.getArticles);

export { router as GuestRouter };