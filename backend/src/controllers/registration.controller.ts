import type { NextFunction, Request, Response } from "express";

import { createRegistration } from "../services/registration.service";
import { registrationSchema } from "../schemas/registration.schema";

export const registerCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = registrationSchema.parse(req.body);

        const registration = await createRegistration(req.body);

        return res.status(201).json(registration);
    } catch (error) {
        next(error);
    }
};