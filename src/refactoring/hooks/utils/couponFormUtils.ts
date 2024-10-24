import { Coupon } from "../../../types";

export const createInitialCoupon = (): Coupon => ({
  name: "",
  code: "",
  discountType: "percentage",
  discountValue: 0,
});

export const updateCouponField = (
  coupon: Coupon,
  target: { name: keyof Coupon; value: string; type?: string }
): Coupon => {
  const { type, name, value } = target;
  return {
    ...coupon,
    [name]: type === "number" ? parseInt(value) : value,
  };
};
