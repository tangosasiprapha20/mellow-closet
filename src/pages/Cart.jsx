import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Cart({ cart, removeFromCart }) {
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * (item.quantity ?? 1),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 via-zinc-50 to-zinc-100 px-5 py-8 text-left md:px-8 md:py-12">
      <div className="mx-auto max-w-2xl">
        <Link
          to="/home"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          กลับไปเลือกสินค้า
        </Link>

        <h1 className="mb-2 text-3xl font-semibold tracking-tight text-zinc-900">
          ตะกร้าสินค้า
        </h1>
        <p className="mb-8 text-zinc-500">
          ตรวจสอบรายการก่อนชำระเงิน
        </p>

        {cart.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/60 px-8 py-16 text-center">
            <p className="text-zinc-600">ยังไม่มีสินค้าในตะกร้า</p>
            <Link
              to="/home"
              className="mt-6 inline-flex rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              ไปเลือกสินค้า
            </Link>
          </div>
        ) : (
          <>
            <ul className="space-y-3">
              {cart.map((item, index) => (
                <li
                  key={`${item.id}-${index}`}
                  className="flex gap-4 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm"
                >
                  <img
                    src={item.image}
                    alt=""
                    className="h-24 w-24 shrink-0 rounded-xl object-cover ring-1 ring-zinc-100"
                  />
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-zinc-900">{item.name}</h2>
                    <p className="mt-1 text-sm text-zinc-500">
                      ฿{item.price}{" "}
                      <span className="text-zinc-400">
                        × {item.quantity ?? 1}
                      </span>
                    </p>
                    <button
                      type="button"
                      onClick={() => removeFromCart?.(item.id)}
                      className="mt-3 inline-flex rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50"
                    >
                      ลบออก
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
              <div className="flex items-baseline justify-between border-b border-zinc-100 pb-4">
                <span className="text-sm font-medium text-zinc-500">ยอดรวม</span>
                <span className="text-2xl font-semibold tabular-nums text-zinc-900">
                  ฿{totalPrice}
                </span>
              </div>
              <Link to="/checkout" className="mt-5 block">
                <span className="flex w-full items-center justify-center rounded-xl bg-zinc-900 py-3.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 active:scale-[0.99]">
                  ดำเนินการชำระเงิน
                </span>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
