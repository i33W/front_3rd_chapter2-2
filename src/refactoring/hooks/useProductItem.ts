import { useState } from "react";
import { Discount, Product } from "../../types";

interface Props {
  product: Product;
  onProductUpdate: (updatedProduct: Product) => void;
}

const useProductItem = ({ product, onProductUpdate }: Props) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newDiscount, setNewDiscount] = useState<Discount>({
    quantity: 0,
    rate: 0,
  });
  const [showProductAccordion, setShowProductAccordion] = useState(false);

  const toggleProductAccordion = () => {
    setShowProductAccordion((prev) => !prev);
  };

  // 수정 버튼 핸들러
  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
  };

  // 수정 완료 버튼 핸들러
  const handleEditComplete = () => {
    if (editingProduct) {
      onProductUpdate(editingProduct);
      setEditingProduct(null);
    }
  };

  // 수정 입력값 변경 핸들러
  const handleEditingProductChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { type, name, value } = e.target;
    if (editingProduct) {
      setEditingProduct((prevEditingProduct) => ({
        ...prevEditingProduct!,
        [name]: type === "number" ? parseInt(value) : value,
      }));
    }
  };

  // 할인 정보 변경 핸들러
  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value =
      name === "quantity"
        ? parseInt(e.target.value)
        : parseInt(e.target.value) / 100;

    setNewDiscount((prevDiscount) => ({
      ...prevDiscount,
      [name]: value,
    }));
  };

  // 할인 추가 버튼 핸들러
  const handleAddDiscount = () => {
    if (product && editingProduct && showProductAccordion) {
      setEditingProduct((editingProduct) => ({
        ...editingProduct!,
        discounts: [...editingProduct!.discounts, newDiscount],
      }));
      setNewDiscount({ quantity: 0, rate: 0 });
    }
  };

  // 할인 삭제 버튼 핸들러
  const handleRemoveDiscount = (index: number) => {
    if (product && editingProduct && showProductAccordion) {
      setEditingProduct((editingProduct) => ({
        ...editingProduct!,
        discounts: editingProduct!.discounts.filter((_, i) => i !== index),
      }));
    }
  };

  return {
    showProductAccordion,
    editingProduct,
    newDiscount,
    toggleProductAccordion,
    handleEditProduct,
    handleEditComplete,
    handleEditingProductChange,
    handleDiscountChange,
    handleAddDiscount,
    handleRemoveDiscount,
  };
};

export default useProductItem;
