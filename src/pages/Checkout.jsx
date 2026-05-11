import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import PromptPayQR from "promptpay-qr"; // ✅ FIX: ต้องใช้แบบนี้

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

  // ✅ FIX: สร้าง PromptPay QR จริง
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
    "mb-2 w-full rounded-lg border border-zinc-300 bg-white p-3 text-base text-zinc-900";

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
          "ชำระเงินสำเร็จแล้ว สามารถกดปุ่มดูประวัติการสั่งซื้อเพื่อตรวจสอบรายการได้",
      });
      window.setTimeout(() => setToast(null), 4500);
    } catch {
      setToast({
        type: "error",
        message: "เกิดข้อผิดพลาดในการสั่งซื้อ กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex justify-center items-start p-6">

      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow">

        <h1 className="text-xl font-bold mb-4">Checkout</h1>

        <input
          className={fieldClass}
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
          placeholder="ที่อยู่"
          value={address}
          rows={4}
          className={`${fieldClass} min-h-[110px] resize-y`}
          autoComplete="street-address"
          onChange={(e) => setAddress(e.target.value)}
        />

        {/* รายการสินค้า */}
        <div className="text-sm mb-3">
          {items.map((item) => (
            <div key={item.id}>
              {item.name} ×{item.quantity || 1}
            </div>
          ))}
        </div>

        <p className="font-bold mb-3">รวม ฿{total}</p>

        {/* ปุ่มเปิด QR */}
        {!showQR ? (
          <button
            onClick={openPayment}
            disabled={!isCustomerInfoValid || !items.length}
            className={`w-full py-2 rounded-xl text-white ${
              isCustomerInfoValid && items.length
                ? "bg-black"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            ชำระเงิน (PromptPay)
          </button>
        ) : (
          <div className="space-y-4">

            <div className="text-center border p-4 rounded-xl">
              <h2 className="font-bold mb-2">สแกนเพื่อโอน</h2>

              {promptPayPayload ? (
                <div className="flex justify-center">
                  <QRCodeSVG value={promptPayPayload} size={200} />
                </div>
              ) : (
                <p className="text-red-500">สร้าง QR ไม่ได้</p>
              )}

              <p className="mt-2 text-sm">ยอด: ฿{total}</p>
            </div>

            <button
              onClick={handleConfirmOrder}
              type="button"
              disabled={isSubmitting}
              className={`w-full py-2 rounded-xl text-white ${
                isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-600"
              }`}
            >
              {isSubmitting ? "กำลังส่งออเดอร์..." : "ยืนยันออเดอร์"}
            </button>

            <Link
              to="/orders"
              className="flex w-full items-center justify-center rounded-xl border border-zinc-300 bg-white py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50"
            >
              ดูประวัติการสั่งซื้อ
            </Link>

            <p className="text-center text-sm text-zinc-600">
              โอนแล้วแจ้งสลิปใน Line/Instagram
            </p>

          </div>
        )}

      </div>

      {toast && (
        <div className="fixed inset-x-0 bottom-5 z-50 px-4">
          <div
            className={`mx-auto flex w-full max-w-md items-start justify-between gap-3 rounded-xl border p-4 shadow-lg ${
              toast.type === "success"
                ? "border-green-200 bg-green-50 text-green-900"
                : "border-red-200 bg-red-50 text-red-900"
            }`}
            role="status"
            aria-live="polite"
          >
            <p className="text-sm leading-relaxed">{toast.message}</p>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="rounded-md px-2 py-1 text-sm font-semibold opacity-80 hover:opacity-100"
            >
              ปิด
            </button>
          </div>
          {toast.type === "success" && (
            <div className="mx-auto mt-2 w-full max-w-md">
              <Link
                to="/orders"
                onClick={() => setToast(null)}
                className="block w-full rounded-xl bg-zinc-900 py-2.5 text-center text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                ดูประวัติการสั่งซื้อ
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
