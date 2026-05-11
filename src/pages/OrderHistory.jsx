import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function OrderHistory({
  orderHistory = [],
  onCancelOrder = () => {},
}) {
  const handleCancel = async (orderId) => {
    const ok = window.confirm(
      `ยืนยันยกเลิกออเดอร์ #${orderId} ?`
    );
    if (!ok) return;
    await onCancelOrder(orderId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 via-zinc-50 to-zinc-100 px-5 py-8 text-left md:px-8 md:py-12">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/home"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          กลับหน้าแรก
        </Link>

        <h1 className="mb-2 text-3xl font-semibold tracking-tight text-zinc-900">
          ประวัติการสั่งซื้อ
        </h1>
        <p className="mb-8 text-zinc-500">
          รายการออเดอร์ล่าสุดของคุณจะถูกบันทึกไว้ที่หน้านี้
        </p>

        {orderHistory.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/60 px-8 py-16 text-center">
            <p className="text-zinc-600">ยังไม่มีประวัติการสั่งซื้อ</p>
            <Link
              to="/home"
              className="mt-6 inline-flex rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              ไปเลือกสินค้า
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {orderHistory.map((order) => (
              <li
                key={order.orderId}
                className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-lg font-semibold text-zinc-900">
                    ออเดอร์ #{order.orderId}
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        order.status === "canceled"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {order.status === "canceled" ? "ยกเลิกแล้ว" : "ชำระเงินแล้ว"}
                    </span>
                    <p className="text-sm text-zinc-500">
                      {new Date(order.createdAt).toLocaleString("th-TH")}
                    </p>
                  </div>
                </div>

                <div className="mt-3 space-y-1 text-sm text-zinc-700">
                  <p>ลูกค้า: {order.name || "-"}</p>
                  <p>เบอร์โทร: {order.phone || "-"}</p>
                  <p>ที่อยู่: {order.address || "-"}</p>
                </div>

                <div className="mt-4 rounded-xl bg-zinc-50 p-3">
                  {order.items.map((item, idx) => (
                    <p key={`${order.orderId}-${item.id}-${idx}`} className="text-sm text-zinc-700">
                      {item.name} ×{item.quantity || 1} = ฿
                      {item.price * (item.quantity || 1)}
                    </p>
                  ))}
                </div>

                <p className="mt-4 text-right text-base font-semibold text-zinc-900">
                  รวม ฿{order.total}
                </p>

                <div className="mt-3 flex justify-end">
                  {order.status === "canceled" ? (
                    <p className="text-xs text-red-600">
                      ยกเลิกเมื่อ{" "}
                      {order.canceledAt
                        ? new Date(order.canceledAt).toLocaleString("th-TH")
                        : "-"}
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleCancel(order.orderId)}
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100"
                    >
                      ยกเลิกออเดอร์
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

