import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const IMG_FALLBACK =
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop";

export default function Cart({ cart, removeFromCart }) {
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * (item.quantity ?? 1),
    0
  );

  return (
    <div className="min-h-screen bg-[#fafafa] px-5 py-10 md:px-8 md:py-14">
      <div className="mx-auto max-w-xl">
        <Link
          to="/home"
          className="mb-10 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-500 transition hover:text-neutral-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
          กลับ
        </Link>

        <h1 className="text-2xl font-light tracking-tight text-neutral-900">
          ตะกร้า
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          ตรวจรายการก่อนชำระเงิน
        </p>

        {cart.length === 0 ? (
          <div className="mt-12 border border-dashed border-neutral-200 bg-white px-8 py-16 text-center">
            <p className="text-sm text-neutral-500">ตะกร้าว่าง</p>
            <Link
              to="/home"
              className="mt-8 inline-block border border-neutral-900 bg-neutral-900 px-6 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-neutral-900"
            >
              เลือกสินค้า
            </Link>
          </div>
        ) : (
          <>
            <ul className="mt-10 divide-y divide-neutral-200 border border-neutral-200 bg-white">
              {cart.map((item, index) => (
                <li
                  key={`${item.id}-${index}`}
                  className="flex gap-4 p-4 md:p-5"
                >
                  <img
                    src={item.image || IMG_FALLBACK}
                    alt={item.name}
                    loading="lazy"
                    className="h-24 w-20 shrink-0 object-cover bg-neutral-100"
                  />
                  <div className="min-w-0 flex-1">
                    <h2 className="text-sm font-medium text-neutral-900">
                      {item.name}
                    </h2>
                    <p className="mt-1 text-sm tabular-nums text-neutral-500">
                      ฿{Number(item.price).toLocaleString("th-TH")} × {item.quantity ?? 1}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeFromCart?.(item.id)}
                      className="mt-3 text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-400 underline decoration-neutral-200 underline-offset-4 hover:text-neutral-900"
                    >
                      ลบ
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 border border-neutral-200 bg-white p-6">
              <div className="flex items-baseline justify-between border-b border-neutral-100 pb-4">
                <span className="text-[11px] uppercase tracking-[0.15em] text-neutral-400">
                  รวม
                </span>
                <span className="text-lg font-light tabular-nums text-neutral-900">
                  ฿{totalPrice.toLocaleString("th-TH")}
                </span>
              </div>
              <Link to="/checkout" className="mt-6 block">
                <span className="flex w-full items-center justify-center border border-neutral-900 bg-neutral-900 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-neutral-900">
                  ชำระเงิน
                </span>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
