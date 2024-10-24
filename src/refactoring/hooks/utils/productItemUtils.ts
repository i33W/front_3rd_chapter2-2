import { Discount, Product } from "../../../types";

export const createEmptyDiscount = (): Discount => ({ quantity: 0, rate: 0 });

export const updateProductField = (
  product: Product,
  target: { name: string; value: string; type: string }
): Product => {
  const { name, value, type } = target;
  return {
    ...product,
    [name]: type === "number" ? parseInt(value) : value,
  };
};

export const updateDiscountField = (
  discount: Discount,
  target: { name: string; value: string }
): Discount => {
  const { name, value } = target;
  if (name === "quantity") return { ...discount, [name]: parseInt(value) };
  if (name === "rate") return { ...discount, [name]: parseInt(value) / 100 };
  return discount;
};

export const updateDiscountList = (
  product: Product,
  newDiscount: Discount
): Product => ({
  ...product,
  discounts: [...product.discounts, newDiscount],
});

export const removeDiscountAtIndex = (
  product: Product,
  index: number
): Product => ({
  ...product,
  discounts: product.discounts.filter((_, i) => i !== index),
});
