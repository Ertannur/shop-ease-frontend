import { useCartStore } from "@/stores";
import { useEffect, useState } from "react";

const CartBadge = () => {
    const [mounted, setMounted] = useState(false);
    const cartItems = useCartStore((state) => state.items);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const itemCount = cartItems.length;

    if (itemCount === 0) return null;

    return (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {itemCount}
                </span>
    )
}

export default CartBadge;