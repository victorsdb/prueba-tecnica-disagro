import { API_URL } from '../config/env';
import type {
  CreateRegistrationRequest,
  RegistrationResponse,
} from '../types/registration';

export async function createRegistration(
  data: CreateRegistrationRequest
): Promise<RegistrationResponse> {
  const response = await fetch(`${API_URL}/registrations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message || 'No se pudo confirmar la asistencia'
    );
  }

  return response.json();
}