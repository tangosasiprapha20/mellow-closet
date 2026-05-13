import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Cart from "./pages/Cart.jsx";
import Login from "./pages/Login.jsx";
import Checkout from "./pages/Checkout.jsx";
import Contact from "./pages/Contact.jsx";
import About from "./pages/About.jsx";
import OrderHistory from "./pages/OrderHistory.jsx";

const LS_ORDER_HISTORY = "mellow-closet.orderHistory";
const LS_ORDER_HISTORY_LEGACY = "mellow.orderHistory";
const LS_ORDER_HISTORY_SOFTLANE = "softlane.orderHistory";
const LS_ORDER_ID = "mellow-closet.orderId";
const LS_ORDER_ID_LEGACY = "mellow.orderId";
const LS_ORDER_ID_SOFTLANE = "softlane.orderId";

function loadOrderHistory() {
  try {
    const raw =
      localStorage.getItem(LS_ORDER_HISTORY) ??
      localStorage.getItem(LS_ORDER_HISTORY_SOFTLANE) ??
      localStorage.getItem(LS_ORDER_HISTORY_LEGACY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadOrderId() {
  try {
    const raw =
      localStorage.getItem(LS_ORDER_ID) ??
      localStorage.getItem(LS_ORDER_ID_SOFTLANE) ??
      localStorage.getItem(LS_ORDER_ID_LEGACY);
    const n = raw ? Number(raw) : 1001;
    return Number.isFinite(n) ? n : 1001;
  } catch {
    return 1001;
  }
}

/** ส่งออเดอร์ไป Discord */
async function sendOrderToDiscord({
  cart,
  name,
  phone,
  address,
  slipFile,
  orderId,
}) {
  const url = import.meta.env.VITE_DISCORD_WEBHOOK_URL;

  if (!url) {
    console.log("WEBHOOK =", import.meta.env.VITE_DISCORD_WEBHOOK_URL);
    return;
  }

  if (!Array.isArray(cart) || cart.length === 0) {
    console.log("cart ว่าง");
    return;
  }

  const items = cart
    .map((p) => {
      const qty = p.quantity || 1;
      return `• ${p.name} x${qty} = ฿${p.price * qty}`;
    })
    .join("\n");

  const total = cart.reduce(
    (sum, p) => sum + p.price * (p.quantity || 1),
    0
  );

  const payload = {
    embeds: [
      {
        title: `🛒 ออเดอร์ #${orderId}`,
        color: 0xe5e5e5,

        fields: [
          {
            name: "👤 ลูกค้า",
            value: name || "-",
            inline: true,
          },
          {
            name: "📞 เบอร์",
            value: phone || "-",
            inline: true,
          },
          {
            name: "📍 ที่อยู่",
            value: address || "-",
          },
          {
            name: "รายการสินค้า",
            value: items || "-",
          },
          {
            name: "💰 ราคารวม",
            value: `฿${total}`,
            inline: true,
          },
        ],

        footer: {
          text: "Mellow-Closet Order System",
        },

        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    const hasSlip = slipFile instanceof File;

    const res = hasSlip
      ? await fetch(url, {
          method: "POST",
          body: (() => {
            const fd = new FormData();

            fd.append(
              "payload_json",
              JSON.stringify(payload)
            );

            fd.append(
              "files[0]",
              slipFile,
              slipFile.name || "slip.jpg"
            );

            return fd;
          })(),
        })
      : await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

    console.log("Discord status:", res.status);
  } catch (err) {
    console.log("Discord error:", err);
  }
}

/** ส่งแจ้งเตือนยกเลิกออเดอร์ไป Discord */
async function sendOrderCancellationToDiscord(order) {
  const url = import.meta.env.VITE_DISCORD_WEBHOOK_URL;
  if (!url || !order) return;

  const itemsText = (order.items || [])
    .map((item) => {
      const qty = item.quantity || 1;
      return `• ${item.name} x${qty} = ฿${item.price * qty}`;
    })
    .join("\n");

  const payload = {
    embeds: [
      {
        title: `❌ ยกเลิกออเดอร์ #${order.orderId}`,
        color: 0xd4d4d4,
        fields: [
          { name: "👤 ลูกค้า", value: order.name || "-", inline: true },
          { name: "📞 เบอร์", value: order.phone || "-", inline: true },
          { name: "📍 ที่อยู่", value: order.address || "-" },
          { name: "รายการสินค้า", value: itemsText || "-" },
          { name: "💰 ยอดเดิม", value: `฿${order.total || 0}`, inline: true },
          {
            name: "🕒 เวลาที่ยกเลิก",
            value: order.canceledAt
              ? new Date(order.canceledAt).toLocaleString("th-TH")
              : new Date().toLocaleString("th-TH"),
            inline: true,
          },
        ],
        footer: { text: "Mellow-Closet Order System" },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    console.log("Discord cancel status:", res.status);
  } catch (err) {
    console.log("Discord cancel error:", err);
  }
}

export default function App() {
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [orderHistory, setOrderHistory] = useState(loadOrderHistory);

  // ✅ เลขออเดอร์
  const [orderId, setOrderId] = useState(loadOrderId);

  useEffect(() => {
    try {
      localStorage.setItem(LS_ORDER_HISTORY, JSON.stringify(orderHistory));
    } catch {
      // ignore write failures
    }
  }, [orderHistory]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_ORDER_ID, String(orderId));
    } catch {
      // ignore write failures
    }
  }, [orderId]);

  const products = [
    {
      id: 1,
      name: "เชิ้ตลินิน oversize",
      price: 890,
      image:
        "https://images.unsplash.com/photo-1596755094514-f87c340781d1?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "เสื้อคลาสสิกทรงมินิมอล",
      price: 690,
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: 3,
      name: "ฮู้ดดี้เนื้อนุ่ม",
      price: 1190,
      image:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: 4,
      name: "กางเกงยีนส์ทรงตรง",
      price: 1290,
      image:
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: 5,
      name: "โท้ทผ้าแคนวาส",
      price: 790,
      image:
        "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: 6,
      name: "สเวตเตอร์ถักโทนเนียร์ทรัล",
      price: 1390,
      image:
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: 7,
      name: "เดรสมินิเรียบ",
      price: 1590,
      image:
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: 8,
      name: "เข็มขัดหนังเรียบ",
      price: 490,
      image:
        "https://images.unsplash.com/photo-1624222247344-550fb60583fd?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: 9,
      name: "รองเท้าผ้าใบมินิมอล",
      price: 2490,
      image:
        "https://images.unsplash.com/photo-1528701800489-20be3c2ea06b?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: 10,
      name: "หมวกบีนนี่ถัก",
      price: 390,
      image:
        "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: 11,
      name: "กระโปรงพลีทยาว",
      price: 990,
      image:
        "https://images.unsplash.com/photo-1583496661160-fb5886a0aa0b?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: 12,
      name: "เบลเซอร์ oversize",
      price: 2290,
      image:
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: 13,
      name: "เสื้อยืดคอกลมขาว",
      price: 490,
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop",
    },
  ];

  /** คอลเลกชันที่กำลังจะเข้า (แสดงหน้าแรกเท่านั้น) */
  const comingSoon = [
    {
      id: "soon-1",
      name: "เทรนช์โค้ทซีซันใหม่",
      teaser: "ผ้าโทนครีม ตัดเย็บเรียบ",
      eta: "เร็วๆ นี้",
      image:
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: "soon-2",
      name: "เซ็ตลุคลำลองในบ้าน",
      teaser: "เสื้อผ้าเนื้อนุ่ม โทนเดียวกับร้าน",
      eta: "ปลายเดือนนี้",
      image:
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: "soon-3",
      name: "รองเท้าแตะหนังเรียบ",
      teaser: "สายเดี่ยว ดีไซน์มินิมอล",
      eta: "สัปดาห์หน้า",
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop",
    },
  ];

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);

      if (!existing) {
        return [...prev, { ...product, quantity: 1 }];
      }

      return prev.map((p) =>
        p.id === product.id
          ? {
              ...p,
              quantity: (p.quantity || 1) + 1,
            }
          : p
      );
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) =>
      prev.filter((p) => p.id !== id)
    );
  };

  // ✅ ส่งออเดอร์ + เพิ่มเลขออเดอร์
  const clearCart = async (orderData) => {
    const payload =
      orderData && Array.isArray(orderData.cart)
        ? {
            cart: [...orderData.cart],
            name: orderData.name,
            phone: orderData.phone,
            address: orderData.address,
            slipFile: orderData.slipFile ?? null,
            orderId,
          }
        : {
            cart: [...cart],
            name: "-",
            phone: "-",
            address: "-",
            slipFile: null,
            orderId,
          };

    await sendOrderToDiscord(payload);

    const purchasedItems = [...payload.cart];
    const total = purchasedItems.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );

    setOrderHistory((prev) => [
      {
        orderId: payload.orderId,
        name: payload.name,
        phone: payload.phone,
        address: payload.address,
        items: purchasedItems,
        total,
        createdAt: new Date().toISOString(),
        status: "paid",
        canceledAt: null,
      },
      ...prev,
    ]);

    // ✅ เพิ่มเลขออเดอร์อัตโนมัติ
    setOrderId((prev) => prev + 1);

    setCart([]);
  };

  const cancelOrder = async (targetOrderId) => {
    let canceledOrder = null;
    setOrderHistory((prev) =>
      prev.map((order) =>
        order.orderId === targetOrderId && order.status !== "canceled"
          ? (() => {
              canceledOrder = {
                ...order,
                status: "canceled",
                canceledAt: new Date().toISOString(),
              };
              return canceledOrder;
            })()
          : order
      )
    );
    if (canceledOrder) {
      await sendOrderCancellationToDiscord(canceledOrder);
    }
  };

  const removeOrderFromHistory = (targetOrderId) => {
    const ok = window.confirm(
      `ลบออเดอร์ #${targetOrderId} ออกจากประวัติบนเครื่องนี้?`
    );
    if (!ok) return;
    setOrderHistory((prev) =>
      prev.filter((o) => o.orderId !== targetOrderId)
    );
  };

  const clearAllOrderHistory = () => {
    const ok = window.confirm(
      "ลบประวัติการสั่งซื้อทั้งหมดจากเครื่องนี้? ไม่สามารถกู้คืนได้"
    );
    if (!ok) return;
    setOrderHistory([]);
  };

  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/home" replace />
            ) : (
              <Login setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />

        <Route
          path="/home"
          element={
            isLoggedIn ? (
              <Home
                products={products}
                comingSoon={comingSoon}
                addToCart={addToCart}
                cart={cart}
                setIsLoggedIn={setIsLoggedIn}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/orders"
          element={
            isLoggedIn ? (
              <OrderHistory
                orderHistory={orderHistory}
                onCancelOrder={cancelOrder}
                onRemoveOrder={removeOrderFromHistory}
                onClearAllOrders={clearAllOrderHistory}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/cart"
          element={
            isLoggedIn ? (
              <Cart
                cart={cart}
                removeFromCart={removeFromCart}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/checkout"
          element={
            isLoggedIn ? (
              <Checkout
                cart={cart}
                clearCart={clearCart}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/contact"
          element={
            isLoggedIn ? (
              <Contact />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/about"
          element={
            isLoggedIn ? (
              <About />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

      </Routes>
    </BrowserRouter>
  );
}