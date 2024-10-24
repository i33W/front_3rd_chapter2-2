import { Product } from "../../../types";
import useNewProduct from "../../hooks/useNewProduct";

interface Props {
  onProductAdd: (newProduct: Product) => void;
}

const NewProduct = ({ onProductAdd }: Props) => {
  const {
    showNewProductForm,
    newProduct,
    handleAddNewProduct,
    toggleNewProductForm,
    handleProductChange,
  } = useNewProduct({ onProductAdd });

  return (
    <>
      <button
        onClick={toggleNewProductForm}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
      >
        {showNewProductForm ? "취소" : "새 상품 추가"}
      </button>
      {showNewProductForm && (
        <div className="bg-white p-4 rounded shadow mb-4">
          <h3 className="text-xl font-semibold mb-2">새 상품 추가</h3>
          <div className="mb-2">
            <label
              htmlFor="productName"
              className="block text-sm font-medium text-gray-700"
            >
              상품명
            </label>
            <input
              id="productName"
              name="name"
              type="text"
              value={newProduct.name}
              onChange={handleProductChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="productPrice"
              className="block text-sm font-medium text-gray-700"
            >
              가격
            </label>
            <input
              id="productPrice"
              name="price"
              type="number"
              value={newProduct.price}
              onChange={handleProductChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="productStock"
              className="block text-sm font-medium text-gray-700"
            >
              재고
            </label>
            <input
              id="productStock"
              name="stock"
              type="number"
              value={newProduct.stock}
              onChange={handleProductChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            onClick={handleAddNewProduct}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            추가
          </button>
        </div>
      )}
    </>
  );
};

export default NewProduct;
