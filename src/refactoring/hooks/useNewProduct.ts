import { useCallback, useState } from "react";
import { Product } from "../../types";
import {
  createEmptyProduct,
  createProduct,
  updateProductField,
} from "./utils/newProductUtils";

interface Props {
  onProductAdd: (newProduct: Product) => void;
}

interface UseNewProductReturn {
  showNewProductForm: boolean;
  newProduct: Omit<Product, "id">;
  handleAddNewProduct: () => void;
  toggleNewProductForm: () => void;
  handleProductChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const useNewProduct = ({ onProductAdd }: Props): UseNewProductReturn => {
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [newProduct, setNewProduct] =
    useState<Omit<Product, "id">>(createEmptyProduct());

  const handleAddNewProduct = useCallback(() => {
    const productWithId = createProduct(newProduct);
    onProductAdd(productWithId);
    setNewProduct(createEmptyProduct());
    setShowNewProductForm(false);
  }, [newProduct, onProductAdd]);

  const toggleNewProductForm = useCallback(() => {
    setShowNewProductForm((prev) => !prev);
  }, []);

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { type, name, value } = e.target;
    setNewProduct((prev) => updateProductField(prev, name, value, type));
  };

  return {
    showNewProductForm,
    newProduct,
    handleAddNewProduct,
    toggleNewProductForm,
    handleProductChange,
  };
};

export default useNewProduct;
