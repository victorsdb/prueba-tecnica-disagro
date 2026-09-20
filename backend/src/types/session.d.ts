import "express-session";

declare module "express-session" {
    interface SessionData {
        registrationDraft?: {
            currentStep?: number;
            firstName?: string;
            lastName?: string;
            email?: string;
            phone?: string;
            attendanceAt?: string;
            productIds?: number[];
            serviceIds?: number[];
        };
    }
}