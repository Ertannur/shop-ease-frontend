import { useOrderStore } from "@/stores/orderStore";
import Link from "next/link";

const OrdersPage = () => {
  const { orderHistory } = useOrderStore();

  if (orderHistory.length === 0) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Sipariş Geçmişi</h1>
        <p className="text-gray-600 mb-8">Henüz siparişiniz yok.</p>
        <Link
          href="/"
          className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
        >
          Alışverişe Başla
        </Link>
      </div>
    );
  }
  return (
    <div className="container py-8">
      <h1>Sipariş Geçmişi</h1>

      {orderHistory.map((order, index) => (
        <div
          key={order.orderId}
          className="bg-white rounded-lg shadow-md p-6 mb-4"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Sipaiş #{order.orderId}</h3>
            <span className="text-gray-600 font-bold">{order.total.toFixed(2)} TL</span>
          </div>

          <div className="space-y-2">
            {order.products.map((product, index) => (
                <div key={index}>
                    <span>{product.name} x{product.quantity}</span>
                    <span>{product.price * product.quantity} TL</span>
                </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersPage;
