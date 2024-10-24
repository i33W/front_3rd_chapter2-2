import { Product } from "../../../types";

export const createProduct = (baseProduct: Omit<Product, "id">): Product => ({
  ...baseProduct,
  id: Date.now().toString(),
});

export const createEmptyProduct = (): Omit<Product, "id"> => ({
  name: "",
  price: 0,
  stock: 0,
  discounts: [],
});

export const updateNewProductField = (
  product: Omit<Product, "id">,
  name: string,
  value: string,
  type: string
): Omit<Product, "id"> => ({
  ...product,
  [name]: type === "number" ? parseInt(value) : value,
});
