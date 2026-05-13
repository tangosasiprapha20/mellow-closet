import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import PromptPayQR from "promptpay-qr";

const DEFAULT_PROMPTPAY = "0979589118";

export default function Checkout({ cart = [], clearCart }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const items = useMemo(() => (Array.isArray(cart) ? cart : []), [cart]);

  const total = useMemo(
    () => items.reduce((sum, p) => sum + p.price * (p.quantity || 1), 0),
    [items]
  );

  const promptPayPayload = useMemo(() => {
    if (total <= 0) return "";
    try {
      return PromptPayQR(DEFAULT_PROMPTPAY, {
        amount: total,
      });
    } catch (e) {
      console.log(e);
      return "";
    }
  }, [total]);

  const fieldClass =
    "mb-3 w-full border border-neutral-200 bg-white px-3 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900";

  const isCustomerInfoValid =
    name.trim().length > 0 &&
    phone.trim().length > 0 &&
    address.trim().length > 0;

  const openPayment = () => {
    if (!isCustomerInfoValid) {
      setToast({ type: "error", message: "กรุณากรอกข้อมูลให้ครบ" });
      return;
    }
    if (!items.length) {
      setToast({ type: "error", message: "ตะกร้าว่าง" });
      return;
    }
    setShowQR(true);
  };

  const handleConfirmOrder = async () => {
    if (!isCustomerInfoValid) {
      setToast({ type: "error", message: "กรุณากรอกข้อมูลให้ครบ" });
      return;
    }
    if (!items.length) {
      setToast({ type: "error", message: "ตะกร้าว่าง" });
      return;
    }

    try {
      setIsSubmitting(true);
      await clearCart({
        cart: items,
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });

      setShowQR(false);
      setName("");
      setPhone("");
      setAddress("");

      setToast({
        type: "success",
        message:
          "ส่งคำสั่งซื้อแล้ว ดูประวัติได้ที่เมนูคำสั่งซื้อ",
      });
      window.setTimeout(() => setToast(null), 4500);
    } catch {
      setToast({
        type: "error",
        message: "เกิดข้อผิดพลาด กรุณาลองใหม่",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-start justify-center bg-[#fafafa] p-5 py-12 md:p-8">
      <div className="w-full max-w-md border border-neutral-200 bg-white p-8 shadow-sm">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-400">
          Checkout
        </p>
        <h1 className="mt-3 text-xl font-light text-neutral-900">ชำระเงิน</h1>

        <input
          className={`${fieldClass} mt-6`}
          placeholder="ชื่อ"
          value={name}
          type="text"
          autoComplete="name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className={fieldClass}
          placeholder="เบอร์โทร"
          value={phone}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          onChange={(e) => setPhone(e.target.value)}
        />

        <textarea
          placeholder="ที่อยู่จัดส่ง"
          value={address}
          rows={4}
          className={`${fieldClass} min-h-[100px] resize-y`}
          autoComplete="street-address"
          onChange={(e) => setAddress(e.target.value)}
        />

        <div className="mb-4 space-y-1 border-t border-neutral-100 pt-4 text-xs text-neutral-600">
          {items.map((item) => (
            <div key={item.id}>
              {item.name} ×{item.quantity || 1}
            </div>
          ))}
        </div>

        <p className="mb-6 text-sm tabular-nums text-neutral-900">
          รวม <span className="font-medium">฿{total.toLocaleString("th-TH")}</span>
        </p>

        {!showQR ? (
          <button
            type="button"
            onClick={openPayment}
            disabled={!isCustomerInfoValid || !items.length}
            className={`w-full border py-3 text-[11px] font-medium uppercase tracking-[0.2em] transition ${
              isCustomerInfoValid && items.length
                ? "border-neutral-900 bg-neutral-900 text-white hover:bg-white hover:text-neutral-900"
                : "cursor-not-allowed border-neutral-200 bg-neutral-50 text-neutral-400"
            }`}
          >
            PromptPay
          </button>
        ) : (
          <div className="space-y-5">
            <div className="border border-neutral-200 bg-neutral-50 p-5 text-center">
              <p className="text-[11px] uppercase tracking-[0.15em] text-neutral-500">
                สแกนเพื่อโอน
              </p>
              {promptPayPayload ? (
                <div className="mt-4 flex justify-center">
                  <QRCodeSVG value={promptPayPayload} size={192} />
                </div>
              ) : (
                <p className="mt-4 text-sm text-red-600">สร้าง QR ไม่ได้</p>
              )}
              <p className="mt-3 text-sm tabular-nums text-neutral-700">
                ฿{total.toLocaleString("th-TH")}
              </p>
            </div>

            <button
              onClick={handleConfirmOrder}
              type="button"
              disabled={isSubmitting}
              className={`w-full border py-3 text-[11px] font-medium uppercase tracking-[0.2em] ${
                isSubmitting
                  ? "cursor-not-allowed border-neutral-200 text-neutral-400"
                  : "border-neutral-900 bg-white text-neutral-900 hover:bg-neutral-900 hover:text-white"
              }`}
            >
              {isSubmitting ? "กำลังส่ง..." : "ยืนยันคำสั่งซื้อ"}
            </button>

            <Link
              to="/orders"
              className="flex w-full items-center justify-center py-2 text-[11px] uppercase tracking-[0.15em] text-neutral-500 underline decoration-neutral-300 underline-offset-4 hover:text-neutral-900"
            >
              ดูประวัติ
            </Link>

            <p className="text-center text-xs text-neutral-500">
              โอนแล้วแจ้งสลิปทาง Line / Instagram
            </p>
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed inset-x-0 bottom-6 z-50 px-4">
          <div
            className={`mx-auto flex w-full max-w-md items-start justify-between gap-3 border p-4 text-sm ${
              toast.type === "success"
                ? "border-neutral-200 bg-white text-neutral-900"
                : "border-red-200 bg-red-50 text-red-900"
            }`}
            role="status"
            aria-live="polite"
          >
            <p>{toast.message}</p>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="shrink-0 text-xs uppercase tracking-wider text-neutral-500 hover:text-neutral-900"
            >
              ปิด
            </button>
          </div>
          {toast.type === "success" && (
            <div className="mx-auto mt-2 w-full max-w-md">
              <Link
                to="/orders"
                onClick={() => setToast(null)}
                className="block w-full border border-neutral-900 bg-neutral-900 py-2.5 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-white hover:bg-white hover:text-neutral-900"
              >
                ไปที่ประวัติ
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
