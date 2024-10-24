import { useState } from "react";
import { Product } from "../../types";

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
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    price: 0,
    stock: 0,
    discounts: [],
  });

  const handleAddNewProduct = () => {
    const productWithId = { ...newProduct, id: Date.now().toString() };
    onProductAdd(productWithId);
    setNewProduct({
      name: "",
      price: 0,
      stock: 0,
      discounts: [],
    });
    setShowNewProductForm(false);
  };

  const toggleNewProductForm = () => {
    setShowNewProductForm(!showNewProductForm);
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { type, name, value } = e.target;

    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: type === "number" ? parseInt(value) : value,
    }));
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
