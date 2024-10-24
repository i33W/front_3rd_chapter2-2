import { useState } from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  within,
} from "@testing-library/react";
import { CartPage } from "../../refactoring/components/CartPage";
import { AdminPage } from "../../refactoring/components/AdminPage";
import { Coupon, Discount, Product } from "../../types";
import useNewProduct from "../../refactoring/hooks/useNewProduct";
import useProductItem from "../../refactoring/hooks/useProductItem";
import useCouponForm from "../../refactoring/hooks/useCouponForm";
import {
  createEmptyProduct,
  createProduct,
  updateNewProductField,
} from "../../refactoring/hooks/utils/newProductUtils";
import {
  createEmptyDiscount,
  removeDiscountAtIndex,
  updateDiscountField,
  updateDiscountList,
  updateProductField,
} from "../../refactoring/hooks/utils/productItemUtils";
import {
  createInitialCoupon,
  updateCouponField,
} from "../../refactoring/hooks/utils/couponFormUtils";

const mockProducts: Product[] = [
  {
    id: "p1",
    name: "상품1",
    price: 10000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.1 }],
  },
  {
    id: "p2",
    name: "상품2",
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
  },
  {
    id: "p3",
    name: "상품3",
    price: 30000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.2 }],
  },
];
const mockCoupons: Coupon[] = [
  {
    name: "5000원 할인 쿠폰",
    code: "AMOUNT5000",
    discountType: "amount",
    discountValue: 5000,
  },
  {
    name: "10% 할인 쿠폰",
    code: "PERCENT10",
    discountType: "percentage",
    discountValue: 10,
  },
];

const TestAdminPage = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);

  const handleProductUpdate = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const handleProductAdd = (newProduct: Product) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  const handleCouponAdd = (newCoupon: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, newCoupon]);
  };

  return (
    <AdminPage
      products={products}
      coupons={coupons}
      onProductUpdate={handleProductUpdate}
      onProductAdd={handleProductAdd}
      onCouponAdd={handleCouponAdd}
    />
  );
};

describe("advanced > ", () => {
  describe("시나리오 테스트 > ", () => {
    test("장바구니 페이지 테스트 > ", async () => {
      render(<CartPage products={mockProducts} coupons={mockCoupons} />);
      const product1 = screen.getByTestId("product-p1");
      const product2 = screen.getByTestId("product-p2");
      const product3 = screen.getByTestId("product-p3");
      const addToCartButtonsAtProduct1 =
        within(product1).getByText("장바구니에 추가");
      const addToCartButtonsAtProduct2 =
        within(product2).getByText("장바구니에 추가");
      const addToCartButtonsAtProduct3 =
        within(product3).getByText("장바구니에 추가");

      // 1. 상품 정보 표시
      expect(product1).toHaveTextContent("상품1");
      expect(product1).toHaveTextContent("10,000원");
      expect(product1).toHaveTextContent("재고: 20개");
      expect(product2).toHaveTextContent("상품2");
      expect(product2).toHaveTextContent("20,000원");
      expect(product2).toHaveTextContent("재고: 20개");
      expect(product3).toHaveTextContent("상품3");
      expect(product3).toHaveTextContent("30,000원");
      expect(product3).toHaveTextContent("재고: 20개");

      // 2. 할인 정보 표시
      expect(screen.getByText("10개 이상: 10% 할인")).toBeInTheDocument();

      // 3. 상품1 장바구니에 상품 추가
      fireEvent.click(addToCartButtonsAtProduct1); // 상품1 추가

      // 4. 할인율 계산
      expect(screen.getByText("상품 금액: 10,000원")).toBeInTheDocument();
      expect(screen.getByText("할인 금액: 0원")).toBeInTheDocument();
      expect(screen.getByText("최종 결제 금액: 10,000원")).toBeInTheDocument();

      // 5. 상품 품절 상태로 만들기
      for (let i = 0; i < 19; i++) {
        fireEvent.click(addToCartButtonsAtProduct1);
      }

      // 6. 품절일 때 상품 추가 안 되는지 확인하기
      expect(product1).toHaveTextContent("재고: 0개");
      fireEvent.click(addToCartButtonsAtProduct1);
      expect(product1).toHaveTextContent("재고: 0개");

      // 7. 할인율 계산
      expect(screen.getByText("상품 금액: 200,000원")).toBeInTheDocument();
      expect(screen.getByText("할인 금액: 20,000원")).toBeInTheDocument();
      expect(screen.getByText("최종 결제 금액: 180,000원")).toBeInTheDocument();

      // 8. 상품을 각각 10개씩 추가하기
      fireEvent.click(addToCartButtonsAtProduct2); // 상품2 추가
      fireEvent.click(addToCartButtonsAtProduct3); // 상품3 추가

      const increaseButtons = screen.getAllByText("+");
      for (let i = 0; i < 9; i++) {
        fireEvent.click(increaseButtons[1]); // 상품2
        fireEvent.click(increaseButtons[2]); // 상품3
      }

      // 9. 할인율 계산
      expect(screen.getByText("상품 금액: 700,000원")).toBeInTheDocument();
      expect(screen.getByText("할인 금액: 110,000원")).toBeInTheDocument();
      expect(screen.getByText("최종 결제 금액: 590,000원")).toBeInTheDocument();

      // 10. 쿠폰 적용하기
      const couponSelect = screen.getByRole("combobox");
      fireEvent.change(couponSelect, { target: { value: "1" } }); // 10% 할인 쿠폰 선택

      // 11. 할인율 계산
      expect(screen.getByText("상품 금액: 700,000원")).toBeInTheDocument();
      expect(screen.getByText("할인 금액: 169,000원")).toBeInTheDocument();
      expect(screen.getByText("최종 결제 금액: 531,000원")).toBeInTheDocument();

      // 12. 다른 할인 쿠폰 적용하기
      fireEvent.change(couponSelect, { target: { value: "0" } }); // 5000원 할인 쿠폰
      expect(screen.getByText("상품 금액: 700,000원")).toBeInTheDocument();
      expect(screen.getByText("할인 금액: 115,000원")).toBeInTheDocument();
      expect(screen.getByText("최종 결제 금액: 585,000원")).toBeInTheDocument();
    });

    test("관리자 페이지 테스트 > ", async () => {
      render(<TestAdminPage />);

      const $product1 = screen.getByTestId("product-1");

      // 1. 새로운 상품 추가
      fireEvent.click(screen.getByText("새 상품 추가"));

      fireEvent.change(screen.getByLabelText("상품명"), {
        target: { value: "상품4" },
      });
      fireEvent.change(screen.getByLabelText("가격"), {
        target: { value: "15000" },
      });
      fireEvent.change(screen.getByLabelText("재고"), {
        target: { value: "30" },
      });

      fireEvent.click(screen.getByText("추가"));

      const $product4 = screen.getByTestId("product-4");

      expect($product4).toHaveTextContent("상품4");
      expect($product4).toHaveTextContent("15000원");
      expect($product4).toHaveTextContent("재고: 30");

      // 2. 상품 선택 및 수정
      fireEvent.click($product1);
      fireEvent.click(within($product1).getByTestId("toggle-button"));
      fireEvent.click(within($product1).getByTestId("modify-button"));

      act(() => {
        fireEvent.change(within($product1).getByDisplayValue("20"), {
          target: { value: "25" },
        });
        fireEvent.change(within($product1).getByDisplayValue("10000"), {
          target: { value: "12000" },
        });
        fireEvent.change(within($product1).getByDisplayValue("상품1"), {
          target: { value: "수정된 상품1" },
        });
      });

      fireEvent.click(within($product1).getByText("수정 완료"));

      expect($product1).toHaveTextContent("수정된 상품1");
      expect($product1).toHaveTextContent("12000원");
      expect($product1).toHaveTextContent("재고: 25");

      // 3. 상품 할인율 추가 및 삭제
      fireEvent.click($product1);
      fireEvent.click(within($product1).getByTestId("modify-button"));

      // 할인 추가
      act(() => {
        fireEvent.change(screen.getByPlaceholderText("수량"), {
          target: { value: "5" },
        });
        fireEvent.change(screen.getByPlaceholderText("할인율 (%)"), {
          target: { value: "5" },
        });
      });
      fireEvent.click(screen.getByText("할인 추가"));

      expect(
        screen.queryByText("5개 이상 구매 시 5% 할인")
      ).toBeInTheDocument();

      // 할인 삭제
      fireEvent.click(screen.getAllByText("삭제")[0]);
      expect(
        screen.queryByText("10개 이상 구매 시 10% 할인")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("5개 이상 구매 시 5% 할인")
      ).toBeInTheDocument();

      fireEvent.click(screen.getAllByText("삭제")[0]);
      expect(
        screen.queryByText("10개 이상 구매 시 10% 할인")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("5개 이상 구매 시 5% 할인")
      ).not.toBeInTheDocument();

      // 4. 쿠폰 추가
      fireEvent.change(screen.getByPlaceholderText("쿠폰 이름"), {
        target: { value: "새 쿠폰" },
      });
      fireEvent.change(screen.getByPlaceholderText("쿠폰 코드"), {
        target: { value: "NEW10" },
      });
      fireEvent.change(screen.getByRole("combobox"), {
        target: { value: "percentage" },
      });
      fireEvent.change(screen.getByPlaceholderText("할인 값"), {
        target: { value: "10" },
      });

      fireEvent.click(screen.getByText("쿠폰 추가"));

      const $newCoupon = screen.getByTestId("coupon-3");

      expect($newCoupon).toHaveTextContent("새 쿠폰 (NEW10):10% 할인");
    });
  });

  describe("useNewProduct 훅 테스트 > ", () => {
    const mockOnProductAdd = vi.fn();

    beforeEach(() => {
      mockOnProductAdd.mockClear();
    });

    test("NewProduct의 초기 상태 확인", () => {
      const initialProduct = {
        name: "",
        price: 0,
        stock: 0,
        discounts: [],
      };

      const { result } = renderHook(() =>
        useNewProduct({ onProductAdd: mockOnProductAdd })
      );

      expect(result.current.showNewProductForm).toBe(false);
      expect(result.current.newProduct).toEqual(initialProduct);
    });

    test("새 상품 추가/취소 버튼 토글 확인", () => {
      const { result } = renderHook(() =>
        useNewProduct({ onProductAdd: mockOnProductAdd })
      );

      act(() => {
        result.current.toggleNewProductForm();
      });

      expect(result.current.showNewProductForm).toBe(true);

      act(() => {
        result.current.toggleNewProductForm();
      });

      expect(result.current.showNewProductForm).toBe(false);
    });

    test("새 상품 추가 input 값 변경 확인", () => {
      const nameChangedTarget = {
        name: "name",
        value: "변경된 이름",
        type: "text",
      };
      const priceChangedTarget = {
        name: "price",
        value: 10000,
        type: "number",
      };
      const stockChangedTarget = {
        name: "stock",
        value: 100,
        type: "number",
      };

      const { result } = renderHook(() =>
        useNewProduct({ onProductAdd: mockOnProductAdd })
      );

      act(() => {
        result.current.handleProductChange({
          target: nameChangedTarget,
        } as React.ChangeEvent<HTMLInputElement>);
      });
      expect(result.current.newProduct.name).toBe(nameChangedTarget.value);

      act(() => {
        result.current.handleProductChange({
          target: priceChangedTarget,
        } as unknown as React.ChangeEvent<HTMLInputElement>);
      });
      expect(result.current.newProduct.price).toBe(priceChangedTarget.value);

      act(() => {
        result.current.handleProductChange({
          target: stockChangedTarget,
        } as unknown as React.ChangeEvent<HTMLInputElement>);
      });
      expect(result.current.newProduct.stock).toBe(stockChangedTarget.value);
    });

    test("새 상품 추가 확인", () => {
      const { result } = renderHook(() =>
        useNewProduct({ onProductAdd: mockOnProductAdd })
      );

      act(() => {
        result.current.handleProductChange({
          target: { name: "name", value: "테스트 상품", type: "text" },
        } as React.ChangeEvent<HTMLInputElement>);
        result.current.handleProductChange({
          target: { name: "price", value: "1000", type: "number" },
        } as React.ChangeEvent<HTMLInputElement>);
        result.current.handleProductChange({
          target: { name: "stock", value: "10", type: "number" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      act(() => {
        result.current.handleAddNewProduct();
      });

      expect(mockOnProductAdd).toHaveBeenCalledWith({
        name: "테스트 상품",
        price: 1000,
        stock: 10,
        discounts: [],
        id: expect.any(String),
      });

      expect(result.current.newProduct).toEqual({
        name: "",
        price: 0,
        stock: 0,
        discounts: [],
      });

      expect(result.current.showNewProductForm).toBe(false);
    });
  });

  describe("useProductItem 훅 테스트 > ", () => {
    const product: Product = {
      id: "1",
      name: "테스트 상품",
      price: 10000,
      stock: 100,
      discounts: [
        { quantity: 10, rate: 0.1 },
        { quantity: 20, rate: 0.2 },
      ],
    };

    const mockOnProductUpdate = vi.fn();

    beforeEach(() => {
      mockOnProductUpdate.mockClear();
    });

    test("ProductItem의 초기 상태 확인", () => {
      const { result } = renderHook(() =>
        useProductItem({ product, onProductUpdate: mockOnProductUpdate })
      );

      expect(result.current.showProductAccordion).toBe(false);
      expect(result.current.editingProduct).toBeNull();
      expect(result.current.newDiscount).toEqual({ quantity: 0, rate: 0 });
    });

    test("상품 리스트 아이템 펼치기 토글 확인", () => {
      const { result } = renderHook(() =>
        useProductItem({ product, onProductUpdate: mockOnProductUpdate })
      );

      act(() => {
        result.current.toggleProductAccordion();
      });

      expect(result.current.showProductAccordion).toBe(true);

      act(() => {
        result.current.toggleProductAccordion();
      });

      expect(result.current.showProductAccordion).toBe(false);
    });

    test("상품 아이템 수정: 버튼 클릭 확인", () => {
      const { result } = renderHook(() =>
        useProductItem({ product, onProductUpdate: mockOnProductUpdate })
      );

      act(() => {
        result.current.handleEditProduct();
      });

      expect(result.current.editingProduct).toEqual(product);
    });

    test("상품 아이템 수정: 완료 버튼 클릭 확인", () => {
      const { result } = renderHook(() =>
        useProductItem({ product, onProductUpdate: mockOnProductUpdate })
      );

      act(() => {
        result.current.handleEditProduct();
      });

      expect(result.current.editingProduct).not.toBe(product);
      expect(result.current.editingProduct).toEqual(product);

      act(() => {
        result.current.handleEditComplete();
      });

      expect(mockOnProductUpdate).toHaveBeenCalledWith({ ...product });
    });

    test("상품 아이템 수정: input 변경 확인", () => {
      const nameChangedTarget = {
        name: "name",
        value: "수정된 상품명",
        type: "text",
      };

      const { result } = renderHook(() =>
        useProductItem({ product, onProductUpdate: mockOnProductUpdate })
      );

      act(() => {
        result.current.toggleProductAccordion();
      });
      expect(result.current.editingProduct).toBeNull();

      act(() => {
        result.current.handleEditProduct();
      });
      expect(result.current.editingProduct).toEqual(product);

      act(() => {
        result.current.handleEditingProductChange({
          target: nameChangedTarget,
        } as React.ChangeEvent<HTMLInputElement>);
      });
      expect(result.current.editingProduct!.name).toBe(nameChangedTarget.value);
    });

    test("상품 아이템 수정: 할인 input 변경 확인", () => {
      const { result } = renderHook(() =>
        useProductItem({ product, onProductUpdate: mockOnProductUpdate })
      );

      act(() => {
        result.current.handleDiscountChange({
          target: { name: "quantity", value: "10", type: "number" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.newDiscount.quantity).toBe(10);
    });

    test("상품 아이템 수정: 할인 추가 버튼 확인", () => {
      const { result } = renderHook(() =>
        useProductItem({ product, onProductUpdate: mockOnProductUpdate })
      );

      act(() => {
        result.current.handleEditProduct();
        result.current.toggleProductAccordion();
        result.current.handleDiscountChange({
          target: { name: "quantity", value: "10", type: "number" },
        } as React.ChangeEvent<HTMLInputElement>);
      });
      act(() => {
        result.current.handleDiscountChange({
          target: { name: "rate", value: "20", type: "number" },
        } as React.ChangeEvent<HTMLInputElement>);
      });
      act(() => {
        result.current.handleAddDiscount();
      });

      expect(result.current.editingProduct).toEqual({
        ...product,
        discounts: [...product.discounts, { quantity: 10, rate: 0.2 }],
      });
      expect(result.current.newDiscount).toEqual({ quantity: 0, rate: 0 });
    });

    test("상품 아이템 수정: 할인 삭제 버튼 확인", () => {
      const productWithDiscount: Product = {
        ...product,
        discounts: [{ quantity: 10, rate: 0.2 }],
      };

      const { result } = renderHook(() =>
        useProductItem({
          product: productWithDiscount,
          onProductUpdate: mockOnProductUpdate,
        })
      );

      act(() => {
        result.current.handleEditProduct();
      });
      act(() => {
        result.current.toggleProductAccordion();
      });
      act(() => {
        result.current.handleRemoveDiscount(0);
      });

      expect(result.current.editingProduct!.discounts).toEqual([]);
    });
  });

  describe("useCouponForm 훅 테스트 > ", () => {
    const initialCoupon: Coupon = {
      name: "",
      code: "",
      discountType: "percentage",
      discountValue: 0,
    };

    const mockOnCouponAdd = vi.fn();

    test("CouponForm의 초기 상태 확인", () => {
      const { result } = renderHook(() =>
        useCouponForm({ onCouponAdd: mockOnCouponAdd })
      );
      expect(result.current.newCoupon).toEqual(initialCoupon);
    });

    test("쿠폰을 추가하고 초기 상태로 재설정", () => {
      const { result } = renderHook(() =>
        useCouponForm({ onCouponAdd: mockOnCouponAdd })
      );

      act(() => {
        result.current.handleAddCoupon();
      });

      expect(mockOnCouponAdd).toHaveBeenCalledWith(initialCoupon);
      expect(result.current.newCoupon).toEqual(initialCoupon);
    });

    test("쿠폰 상태 변경", () => {
      const nameChangedTarget = {
        type: "text",
        name: "name",
        value: "변경된 쿠폰 이름",
      };
      const codeChangedTarget = {
        type: "text",
        name: "code",
        value: "변경된 쿠폰 코드",
      };
      const discountTypeChangedTarget = {
        type: "text",
        name: "discountType",
        value: "amount",
      };
      const discountValueChangedTarget = {
        type: "number",
        name: "discountValue",
        value: "10",
      };

      const { result } = renderHook(() =>
        useCouponForm({ onCouponAdd: mockOnCouponAdd })
      );

      act(() => {
        result.current.handleNewCouponChange({
          target: nameChangedTarget,
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.newCoupon.name).toBe(nameChangedTarget.value);

      act(() => {
        result.current.handleNewCouponChange({
          target: codeChangedTarget,
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.newCoupon.code).toBe(codeChangedTarget.value);

      act(() => {
        result.current.handleNewCouponChange({
          target: discountTypeChangedTarget,
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.newCoupon.discountType).toBe(
        discountTypeChangedTarget.value
      );

      act(() => {
        result.current.handleNewCouponChange({
          target: discountValueChangedTarget,
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.newCoupon.discountValue).toBe(
        parseInt(discountValueChangedTarget.value)
      );
    });
  });

  describe("newProductUtils 유틸 테스트 > ", () => {
    describe("createProduct: ", () => {
      test("unique id를 가진 Product 생성", () => {
        const baseProduct: Omit<Product, "id"> = {
          name: "Test Product",
          price: 1000,
          stock: 10,
          discounts: [],
        };

        const product = createProduct(baseProduct);

        expect(product).toEqual({
          ...baseProduct,
          id: expect.any(String),
        });
      });
    });

    describe("createEmptyProduct: ", () => {
      test("빈 Product 생성", () => {
        const emptyProduct = createEmptyProduct();

        expect(emptyProduct).toEqual({
          name: "",
          price: 0,
          stock: 0,
          discounts: [],
        });
      });
    });

    describe("updateProductField: ", () => {
      test("Product 문자열 값 필드 변경", () => {
        const product: Omit<Product, "id"> = {
          name: "Test Product",
          price: 1000,
          stock: 10,
          discounts: [],
        };

        const updatedProduct = updateNewProductField(
          product,
          "name",
          "Updated Product",
          "text"
        );

        expect(updatedProduct).toEqual({
          ...product,
          name: "Updated Product",
        });
      });

      test("Product 숫자 값 필드 변경", () => {
        const product: Omit<Product, "id"> = {
          name: "Test Product",
          price: 1000,
          stock: 10,
          discounts: [],
        };

        const updatedProduct = updateNewProductField(
          product,
          "price",
          "2000",
          "number"
        );

        expect(updatedProduct).toEqual({
          ...product,
          price: 2000,
        });
      });
    });
  });

  describe("productItemUtils 유틸 테스트 > ", () => {
    describe("createEmptyDiscount: ", () => {
      test("빈 Discount 객체 생성", () => {
        const discount = createEmptyDiscount();
        expect(discount).toEqual({ quantity: 0, rate: 0 });
      });
    });

    describe("updateProductField: ", () => {
      const product: Product = {
        id: "1",
        name: "Test Product",
        price: 1000,
        stock: 10,
        discounts: [],
      };

      test("string 필드 수정", () => {
        const updatedProduct = updateProductField(product, {
          name: "name",
          value: "Updated Product",
          type: "text",
        });
        expect(updatedProduct.name).toBe("Updated Product");
      });

      test("number 필드 수정", () => {
        const updatedProduct = updateProductField(product, {
          name: "price",
          value: "2000",
          type: "number",
        });
        expect(updatedProduct.price).toBe(2000);
      });
    });

    describe("updateDiscountField: ", () => {
      const discount: Discount = { quantity: 10, rate: 0.1 };

      test("quantity 필드 변경", () => {
        const updatedDiscount = updateDiscountField(discount, {
          name: "quantity",
          value: "20",
        });
        expect(updatedDiscount.quantity).toBe(20);
      });

      test("rate 필드 변경", () => {
        const updatedDiscount = updateDiscountField(discount, {
          name: "rate",
          value: "20",
        });
        expect(updatedDiscount.rate).toBe(0.2);
      });
    });

    describe("updateDiscountList: ", () => {
      const product: Product = {
        id: "1",
        name: "Test Product",
        price: 1000,
        stock: 10,
        discounts: [],
      };
      const newDiscount: Discount = { quantity: 5, rate: 0.05 };

      test("새 discount 객체 추가", () => {
        const updatedProduct = updateDiscountList(product, newDiscount);
        expect(updatedProduct.discounts).toContainEqual(newDiscount);
      });
    });

    describe("removeDiscountAtIndex: ", () => {
      const product: Product = {
        id: "1",
        name: "Test Product",
        price: 1000,
        stock: 10,
        discounts: [
          { quantity: 5, rate: 0.05 },
          { quantity: 10, rate: 0.1 },
        ],
      };

      test("discount list에서 index로 삭제 확인", () => {
        const updatedProduct = removeDiscountAtIndex(product, 0);
        expect(updatedProduct.discounts).toHaveLength(1);
        expect(updatedProduct.discounts[0]).toEqual({
          quantity: 10,
          rate: 0.1,
        });
      });
    });
  });

  describe("couponFormUtils 유틸 테스트 > ", () => {
    describe("createInitialCoupon: ", () => {
      test("빈 Coupon 객체 생성", () => {
        const initialCoupon = createInitialCoupon();
        expect(initialCoupon).toEqual({
          name: "",
          code: "",
          discountType: "percentage",
          discountValue: 0,
        });
      });
    });

    describe("updateCouponField: ", () => {
      const coupon: Coupon = {
        name: "Test Coupon",
        code: "TEST10",
        discountType: "percentage",
        discountValue: 10,
      };

      test("string 필드 수정", () => {
        const updatedCoupon = updateCouponField(coupon, {
          name: "name",
          value: "Updated Coupon",
          type: "text",
        });
        expect(updatedCoupon.name).toBe("Updated Coupon");
      });

      test("number 필드 수정", () => {
        const updatedCoupon = updateCouponField(coupon, {
          name: "discountValue",
          value: "20",
          type: "number",
        });
        expect(updatedCoupon.discountValue).toBe(20);
      });

      test("code 필드 수정", () => {
        const updatedCoupon = updateCouponField(coupon, {
          name: "code",
          value: "UPDATED10",
          type: "text",
        });
        expect(updatedCoupon.code).toBe("UPDATED10");
      });

      test("discountType 필드 수정", () => {
        const updatedCoupon = updateCouponField(coupon, {
          name: "discountType",
          value: "amount",
          type: "text",
        });
        expect(updatedCoupon.discountType).toBe("amount");
      });
    });
  });
});
