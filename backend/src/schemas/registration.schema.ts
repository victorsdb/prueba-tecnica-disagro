import { z } from "zod";

export const registrationSchema = z.object({
    name: z
        .string()
        .min(1, "El nombre es obligatorio"),

    email: z
        .email("El correo electrónico no es válido"),

    phone: z
        .string()
        .optional(),

    attendanceAt: z
        .string()
        .min(1, "La fecha y hora de asistencia es obligatoria")
        .refine(
            (value) => !Number.isNaN(Date.parse(value)),
            "La fecha y hora de asistencia no es válida"
        ),

    productIds: z
        .array(z.number().int().positive())
        .refine(
            (ids) => new Set(ids).size === ids.length,
            "No se permiten productos duplicados"
        ),

    serviceIds: z
        .array(z.number().int().positive())
        .refine(
            (ids) => new Set(ids).size === ids.length,
            "No se permiten servicios duplicados"
        )
});