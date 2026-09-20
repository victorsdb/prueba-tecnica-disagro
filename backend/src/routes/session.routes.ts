import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    return res.json({
        draft: req.session.registrationDraft ?? null
    });
});

router.put("/", (req, res) => {
    const {
        currentStep,
        firstName,
        lastName,
        email,
        phone,
        attendanceAt,
        productIds,
        serviceIds
    } = req.body;

    req.session.registrationDraft = {
        currentStep,
        firstName,
        lastName,
        email,
        phone,
        attendanceAt,
        productIds,
        serviceIds
    };

    return res.json({
        message: "Sesión actualizada correctamente",
        draft: req.session.registrationDraft
    });
});

router.delete("/", (req, res, next) => {
    req.session.destroy((error) => {
        if (error) {
            return next(error);
        }

        res.clearCookie("disagro.sid");

        return res.status(204).send();
    });
});

export default router;