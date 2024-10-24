import { useCallback, useState } from "react";
import { Discount, Product } from "../../types";
import {
  createEmptyDiscount,
  removeDiscountAtIndex,
  updateDiscountField,
  updateDiscountList,
  updateProductField,
} from "./utils/productItemUtils";

interface Props {
  product: Product;
  onProductUpdate: (updatedProduct: Product) => void;
}

const useProductItem = ({ product, onProductUpdate }: Props) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newDiscount, setNewDiscount] = useState<Discount>(
    createEmptyDiscount()
  );
  const [showProductAccordion, setShowProductAccordion] = useState(false);

  const toggleProductAccordion = useCallback(() => {
    setShowProductAccordion((prev) => !prev);
  }, []);

  // 수정 버튼 핸들러
  const handleEditProduct = useCallback(() => {
    setEditingProduct({ ...product });
  }, [product]);

  // 수정 완료 버튼 핸들러
  const handleEditComplete = useCallback(() => {
    if (editingProduct) {
      onProductUpdate(editingProduct);
      setEditingProduct(null);
    }
  }, [editingProduct, onProductUpdate]);

  // 수정 입력값 변경 핸들러
  const handleEditingProductChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (editingProduct) {
      setEditingProduct((prevEditingProduct) =>
        updateProductField(prevEditingProduct!, e.target)
      );
    }
  };

  // 할인 정보 변경 핸들러
  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDiscount((prevDiscount) =>
      updateDiscountField(prevDiscount, e.target)
    );
  };

  // 할인 추가 버튼 핸들러
  const handleAddDiscount = useCallback(() => {
    if (editingProduct) {
      setEditingProduct((editingProduct) =>
        updateDiscountList(editingProduct!, newDiscount)
      );
      setNewDiscount(createEmptyDiscount());
    }
  }, [editingProduct, newDiscount]);

  // 할인 삭제 버튼 핸들러
  const handleRemoveDiscount = useCallback(
    (index: number) => {
      if (editingProduct) {
        setEditingProduct((editingProduct) =>
          removeDiscountAtIndex(editingProduct!, index)
        );
      }
    },
    [editingProduct]
  );

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
