import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { AppError } from "../errors/app.error";

export const errorHandler = (
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    if (error instanceof ZodError) {
        return res.status(400).json({
            message: "Datos de registro inválidos",
            errors: error.issues
        });
    }

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            message: error.message
        });
    }

    console.error(error);

    return res.status(500).json({
        message: "Error interno del servidor"
    });
};