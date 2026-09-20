import { API_URL } from '../config/env';

export interface RegistrationDraft {
    currentStep?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    attendanceAt?: string;
    productIds?: number[];
    serviceIds?: number[];
}

export async function getSession(): Promise<RegistrationDraft | null> {
    const response = await fetch(`${API_URL}/session`, {
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error('No se pudo recuperar la sesión');
    }

    const data = await response.json();

    return data.draft;
}

export async function saveSession(
    draft: RegistrationDraft
): Promise<void> {
    const response = await fetch(`${API_URL}/session`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(draft)
    });

    if (!response.ok) {
        throw new Error('No se pudo guardar la sesión');
    }
}

export async function clearSession(): Promise<void> {
    const response = await fetch(`${API_URL}/session`, {
        method: 'DELETE',
        credentials: 'include'
    });

    if (!response.ok && response.status !== 204) {
        throw new Error('No se pudo limpiar la sesión');
    }
}