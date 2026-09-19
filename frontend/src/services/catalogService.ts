import { API_URL } from '../config/env';
import type { Product, Service } from '../types/catalog';

export async function getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_URL}/products`);

    if (!response.ok) {
        throw new Error('No se pudieron cargar los productos');
    }

    return response.json();
}

export async function getServices(): Promise<Service[]> {
    const response = await fetch(`${API_URL}/services`);

    if (!response.ok) {
        throw new Error('No se pudieron cargar los servicios');
    }

    return response.json();
}