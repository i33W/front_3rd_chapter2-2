import { useState } from "react";
import { Coupon } from "../../types";

interface Props {
  onCouponAdd: (newCoupon: Coupon) => void;
}

const useCouponForm = ({ onCouponAdd }: Props) => {
  const initialCoupon: Coupon = {
    name: "",
    code: "",
    discountType: "percentage",
    discountValue: 0,
  };
  const [newCoupon, setNewCoupon] = useState<Coupon>(initialCoupon);

  const handleAddCoupon = () => {
    onCouponAdd(newCoupon);
    setNewCoupon(initialCoupon);
  };

  const handleNewCouponChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { type, name, value } = e.target;
    setNewCoupon((prevNewCoupon) => ({
      ...prevNewCoupon,
      [name]: type === "number" ? parseInt(value) : value,
    }));
  };

  return { newCoupon, handleAddCoupon, handleNewCouponChange };
};

export default useCouponForm;
