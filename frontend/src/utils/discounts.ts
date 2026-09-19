export function calculateServiceDiscount(
  count: number,
  subtotal: number
): number {
  if (count >= 2 && subtotal > 1500) {
    return 5;
  }

  if (count >= 2) {
    return 3;
  }

  return 0;
}

export function calculateProductDiscount(count: number): number {
  if (count >= 5) {
    return 5;
  }

  if (count >= 3) {
    return 3;
  }

  return 0;
}