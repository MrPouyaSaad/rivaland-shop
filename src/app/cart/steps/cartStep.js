import React from "react";
import CartItemCard from "../components/CartItemCard";
import OrderSummary from "../components/OrderSummary";
import { useCart } from '@/contexts/CartContext';
import Button from "@/components/ui/Button";

const CartStep = ({ onNext }) => {
  const { cartItems, cartTotal } = useCart();

  if (!cartItems?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-600 text-lg mb-4">سبد خرید شما خالی است.</p>
        <Button onClick={() => (window.location.href = "/")}>
          بازگشت به فروشگاه
        </Button>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        {cartItems.map((item) => (
          <CartItemCard key={item.id} item={item} />
        ))}
      </div>

      <div className="md:col-span-1">
        <OrderSummary total={cartTotal} onNext={onNext} />
      </div>
    </div>
  );
};

export default CartStep;
