import { Router } from "express";
import { registerCustomer } from "../controllers/registration.controller";

const router = Router();

router.post("/", registerCustomer);

export default router;