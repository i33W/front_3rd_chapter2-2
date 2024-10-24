import { Product } from "../../../types";
import useProductItem from "../../hooks/useProductItem";

interface Props {
  product: Product;
  index: number;
  onProductUpdate: (updatedProduct: Product) => void;
}

const ProductItem = ({ product, index, onProductUpdate }: Props) => {
  const {
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
  } = useProductItem({ product, onProductUpdate });

  return (
    <div
      data-testid={`product-${index + 1}`}
      className="bg-white p-4 rounded shadow"
    >
      <button
        data-testid="toggle-button"
        onClick={toggleProductAccordion}
        className="w-full text-left font-semibold"
      >
        {product.name} - {product.price}원 (재고: {product.stock})
      </button>
      {showProductAccordion && (
        <div className="mt-2">
          {editingProduct ? (
            <div>
              <div className="mb-4">
                <label className="block mb-1">상품명: </label>
                <input
                  name="name"
                  type="text"
                  value={editingProduct.name}
                  onChange={handleEditingProductChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">가격: </label>
                <input
                  name="price"
                  type="number"
                  value={editingProduct.price}
                  onChange={handleEditingProductChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">재고: </label>
                <input
                  name="stock"
                  type="number"
                  value={editingProduct.stock}
                  onChange={handleEditingProductChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              {/* 할인 정보 수정 부분 */}
              <div>
                <h4 className="text-lg font-semibold mb-2">할인 정보</h4>
                {editingProduct.discounts.map((discount, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center mb-2"
                  >
                    <span>
                      {discount.quantity}개 이상 구매 시 {discount.rate * 100}%
                      할인
                    </span>
                    <button
                      onClick={() => handleRemoveDiscount(index)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      삭제
                    </button>
                  </div>
                ))}
                <div className="flex space-x-2">
                  <input
                    name="quantity"
                    type="number"
                    placeholder="수량"
                    value={newDiscount.quantity}
                    onChange={handleDiscountChange}
                    className="w-1/3 p-2 border rounded"
                  />
                  <input
                    name="rate"
                    type="number"
                    placeholder="할인율 (%)"
                    value={newDiscount.rate * 100}
                    onChange={handleDiscountChange}
                    className="w-1/3 p-2 border rounded"
                  />
                  <button
                    onClick={() => handleAddDiscount()}
                    className="w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                  >
                    할인 추가
                  </button>
                </div>
              </div>
              <button
                onClick={handleEditComplete}
                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2"
              >
                수정 완료
              </button>
            </div>
          ) : (
            <div>
              {product.discounts.map((discount, index) => (
                <div key={index} className="mb-2">
                  <span>
                    {discount.quantity}개 이상 구매 시 {discount.rate * 100}%
                    할인
                  </span>
                </div>
              ))}
              <button
                data-testid="modify-button"
                onClick={() => handleEditProduct(product)}
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-2"
              >
                수정
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductItem;
