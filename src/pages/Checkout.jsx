import { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import PromptPayQR from "promptpay-qr"; // ✅ FIX: ต้องใช้แบบนี้

const DEFAULT_PROMPTPAY = "0979589118";

export default function Checkout({ cart = [], clearCart }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [showQR, setShowQR] = useState(false);

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
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    if (!items.length) {
      alert("ตะกร้าว่าง");
      return;
    }
    setShowQR(true);
  };

  const handleConfirmOrder = async () => {
    if (!isCustomerInfoValid) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    if (!items.length) {
      alert("ตะกร้าว่าง");
      return;
    }
   
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

    alert("สั่งซื้อสำเร็จ 🎉");
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
              className={`w-full py-2 rounded-xl text-white ${
                "bg-green-600"
              }`}
            >
              ยืนยันออเดอร์
            </button>

            <p className="text-center text-sm text-zinc-600">
              โอนแล้วแจ้งสลิปในแชท
            </p>

          </div>
        )}

      </div>
    </div>
  );
}
