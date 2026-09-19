export interface CreateRegistrationRequest {
  name: string;
  email: string;
  phone?: string;
  attendanceAt: string;
  productIds: number[];
  serviceIds: number[];
}

type DecimalValue = string | number;

export interface RegistrationResponse {
  id: number;
  customerId: number;
  attendanceAt: string;
  confirmedAt: string;

  productSubtotal: DecimalValue;
  serviceSubtotal: DecimalValue;

  productDiscountPercent: DecimalValue;
  serviceDiscountPercent: DecimalValue;

  productTotal: DecimalValue;
  serviceTotal: DecimalValue;

  grandTotal: DecimalValue;
}