import { Coupon } from "../../../types";
import useCouponForm from "../../hooks/useCouponForm";

interface Props {
  onCouponAdd: (newCoupon: Coupon) => void;
}

const CouponForm = ({ onCouponAdd }: Props) => {
  const { newCoupon, handleAddCoupon, handleNewCouponChange } = useCouponForm({
    onCouponAdd,
  });

  return (
    <div className="space-y-2 mb-4">
      <input
        name="name"
        type="text"
        placeholder="쿠폰 이름"
        value={newCoupon.name}
        onChange={handleNewCouponChange}
        className="w-full p-2 border rounded"
      />
      <input
        name="code"
        type="text"
        placeholder="쿠폰 코드"
        value={newCoupon.code}
        onChange={handleNewCouponChange}
        className="w-full p-2 border rounded"
      />
      <div className="flex gap-2">
        <select
          name="discountType"
          value={newCoupon.discountType}
          onChange={handleNewCouponChange}
          className="w-full p-2 border rounded"
        >
          <option value="amount">금액(원)</option>
          <option value="percentage">할인율(%)</option>
        </select>
        <input
          name="discountValue"
          type="number"
          placeholder="할인 값"
          value={newCoupon.discountValue}
          onChange={handleNewCouponChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <button
        onClick={handleAddCoupon}
        className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
      >
        쿠폰 추가
      </button>
    </div>
  );
};

export default CouponForm;
