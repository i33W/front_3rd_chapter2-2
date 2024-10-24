import { useState } from "react";
import { Coupon } from "../../types";
import {
  createInitialCoupon,
  updateCouponField,
} from "./utils/couponFormUtils";

interface Props {
  onCouponAdd: (newCoupon: Coupon) => void;
}

const useCouponForm = ({ onCouponAdd }: Props) => {
  const [newCoupon, setNewCoupon] = useState<Coupon>(createInitialCoupon());

  const handleAddCoupon = () => {
    onCouponAdd(newCoupon);
    setNewCoupon(createInitialCoupon());
  };

  const handleNewCouponChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setNewCoupon((prevNewCoupon) =>
      updateCouponField(
        prevNewCoupon,
        e.target as { name: keyof Coupon; value: string; type?: string }
      )
    );
  };

  return { newCoupon, handleAddCoupon, handleNewCouponChange };
};

export default useCouponForm;
