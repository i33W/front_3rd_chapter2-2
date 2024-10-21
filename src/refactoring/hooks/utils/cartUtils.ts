import { CartItem, Coupon } from "../../../types";

export const calculateItemTotal = (item: CartItem): number => {
  const {
    quantity,
    product: { price },
  } = item;
  const discountRate = 1 - getMaxApplicableDiscount(item);
  return price * quantity * discountRate;
};

export const getMaxApplicableDiscount = (item: CartItem): number => {
  const {
    quantity,
    product: { discounts },
  } = item;
  const applicableDiscounts = discounts
    .filter(({ quantity: discountQuantity }) => quantity >= discountQuantity)
    .map(({ rate }) => rate);
  return applicableDiscounts.length > 0 ? Math.max(...applicableDiscounts) : 0;
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  const totalBeforeDiscount = cart.reduce(
    (acc, { product: { price }, quantity }) => acc + price * quantity,
    0
  );
  const itemDiscountTotal = cart.reduce(
    (acc, item) => acc + calculateItemTotal(item),
    0
  );

  const totalAfterDiscount = selectedCoupon
    ? applyCouponDiscount(itemDiscountTotal, selectedCoupon)
    : itemDiscountTotal;

  const totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  return { totalBeforeDiscount, totalAfterDiscount, totalDiscount };
};

const applyCouponDiscount = (total: number, coupon: Coupon): number => {
  return coupon.discountType === "amount"
    ? total - coupon.discountValue
    : (total * (100 - coupon.discountValue)) / 100;
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  return cart
    .map((item) => {
      if (item.product.id === productId) {
        if (newQuantity === 0) return null;
        return { ...item, quantity: Math.min(newQuantity, item.product.stock) };
      }
      return item;
    })
    .filter((item) => item !== null);
};
