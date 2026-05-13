import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function OrderHistory({
  orderHistory = [],
  onCancelOrder = () => {},
  onRemoveOrder = () => {},
  onClearAllOrders = () => {},
}) {
  const handleCancel = async (orderId) => {
    const ok = window.confirm(`ยืนยันยกเลิกออเดอร์ #${orderId} ?`);
    if (!ok) return;
    await onCancelOrder(orderId);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] px-5 py-10 md:px-8 md:py-14">
      <div className="mx-auto max-w-2xl">
        <Link
          to="/home"
          className="mb-10 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-500 transition hover:text-neutral-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
          กลับ
        </Link>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light tracking-tight text-neutral-900">
              คำสั่งซื้อ
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              บันทึกบนอุปกรณ์นี้
            </p>
          </div>
          {orderHistory.length > 0 && (
            <button
              type="button"
              onClick={() => onClearAllOrders()}
              className="text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-400 underline decoration-neutral-300 underline-offset-4 hover:text-neutral-900"
            >
              ลบทั้งหมด
            </button>
          )}
        </div>

        {orderHistory.length === 0 ? (
          <div className="mt-14 border border-dashed border-neutral-200 bg-white px-8 py-16 text-center">
            <p className="text-sm text-neutral-500">ยังไม่มีประวัติ</p>
            <Link
              to="/home"
              className="mt-8 inline-block border border-neutral-900 bg-neutral-900 px-6 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-neutral-900"
            >
              เลือกสินค้า
            </Link>
          </div>
        ) : (
          <ul className="mt-10 space-y-6">
            {orderHistory.map((order) => (
              <li
                key={order.orderId}
                className="border border-neutral-200 bg-white p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="text-sm font-medium text-neutral-900">
                    #{order.orderId}
                  </p>
                  <span
                    className={`text-[10px] uppercase tracking-[0.12em] ${
                      order.status === "canceled"
                        ? "text-neutral-400"
                        : "text-neutral-600"
                    }`}
                  >
                    {order.status === "canceled" ? "ยกเลิก" : "ชำระแล้ว"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-neutral-400">
                  {new Date(order.createdAt).toLocaleString("th-TH")}
                </p>

                <div className="mt-4 space-y-1 text-xs text-neutral-600">
                  <p>{order.name}</p>
                  <p>{order.phone}</p>
                  <p className="leading-relaxed">{order.address}</p>
                </div>

                <div className="mt-4 border-t border-neutral-100 pt-4 text-xs text-neutral-600">
                  {order.items.map((item, idx) => (
                    <p key={`${order.orderId}-${item.id}-${idx}`}>
                      {item.name} ×{item.quantity || 1} — ฿
                      {(item.price * (item.quantity || 1)).toLocaleString("th-TH")}
                    </p>
                  ))}
                </div>

                <p className="mt-4 text-right text-sm tabular-nums text-neutral-900">
                  ฿{Number(order.total || 0).toLocaleString("th-TH")}
                </p>

                <div className="mt-4 flex flex-wrap justify-end gap-3">
                  {order.status === "canceled" ? (
                    <p className="text-xs text-neutral-400">
                      ยกเลิกเมื่อ{" "}
                      {order.canceledAt
                        ? new Date(order.canceledAt).toLocaleString("th-TH")
                        : "—"}
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleCancel(order.orderId)}
                      className="text-[11px] uppercase tracking-[0.12em] text-neutral-500 underline decoration-neutral-300 underline-offset-4 hover:text-neutral-900"
                    >
                      ยกเลิกคำสั่งซื้อ
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onRemoveOrder(order.orderId)}
                    className="text-[11px] uppercase tracking-[0.12em] text-neutral-400 underline decoration-neutral-200 underline-offset-4 hover:text-neutral-900"
                  >
                    ลบจากรายการ
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
