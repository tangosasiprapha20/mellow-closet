import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Cart from "./pages/Cart.jsx";
import Login from "./pages/Login.jsx";
import Checkout from "./pages/Checkout.jsx";
import Contact from "./pages/Contact.jsx";
import OrderHistory from "./pages/OrderHistory.jsx";

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
        color: 0x111111,

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
            name: "📦 รายการสินค้า",
            value: items || "-",
          },
          {
            name: "💰 ราคารวม",
            value: `฿${total}`,
            inline: true,
          },
        ],

        footer: {
          text: "Mellow Closet Order System",
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
        color: 0xdc2626,
        fields: [
          { name: "👤 ลูกค้า", value: order.name || "-", inline: true },
          { name: "📞 เบอร์", value: order.phone || "-", inline: true },
          { name: "📍 ที่อยู่", value: order.address || "-" },
          { name: "📦 รายการสินค้า", value: itemsText || "-" },
          { name: "💰 ยอดเดิม", value: `฿${order.total || 0}`, inline: true },
          {
            name: "🕒 เวลาที่ยกเลิก",
            value: order.canceledAt
              ? new Date(order.canceledAt).toLocaleString("th-TH")
              : new Date().toLocaleString("th-TH"),
            inline: true,
          },
        ],
        footer: { text: "Mellow Closet Order System" },
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

/** ส่งแจ้งเตือนล็อกอินเข้า Discord */
async function sendLoginToDiscord(email) {
  const url = import.meta.env.VITE_DISCORD_WEBHOOK_URL;
  if (!url) return;

  const payload = {
    embeds: [
      {
        title: "🔐 มีผู้ใช้เข้าสู่ระบบ",
        color: 0x2563eb,
        fields: [
          {
            name: "📧 อีเมล",
            value: email || "-",
          },
          {
            name: "🕒 เวลา",
            value: new Date().toLocaleString("th-TH"),
            inline: true,
          },
        ],
        footer: { text: "Mellow Closet Login Monitor" },
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
    console.log("Discord login status:", res.status);
  } catch (err) {
    console.log("Discord login error:", err);
  }
}

export default function App() {
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);

  // ✅ เลขออเดอร์
  const [orderId, setOrderId] = useState(1001);

  const products = [
    {
      id: 1,
      name: "Vintage Jacket",
      price: 390,
      image:
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "Korean Shirt",
      price: 250,
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 3,
      name: "Brown Hoodie",
      price: 320,
      image:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 4,
      name: "Denim Jeans",
      price: 420,
      image:
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 5,
      name: "Canvas Tote Bag",
      price: 180,
      image:
        "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 6,
      name: "Wool Sweater",
      price: 360,
      image:
        "https://images.unsplash.com/photo-1520975958221-6d6f4b0b0e8a?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 7,
      name: "Black Dress",
      price: 490,
      image:
        "https://images.unsplash.com/photo-1520975693411-35a46e33f3c3?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 8,
      name: "Leather Belt",
      price: 160,
      image:
        "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 9,
      name: "Sneakers",
      price: 520,
      image:
        "https://images.unsplash.com/photo-1528701800489-20be3c2ea06b?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 10,
      name: "Beanie Hat",
      price: 120,
      image:
        "https://images.unsplash.com/photo-1520975917031-7b3cbb77c4a1?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 11,
      name: "Plaid Skirt",
      price: 310,
      image:
        "https://images.unsplash.com/photo-1520975809650-44d72c36b2b6?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 12,
      name: "Oversized Blazer",
      price: 540,
      image:
        "https://images.unsplash.com/photo-1520975867597-0f0c0f2d8f2b?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 13,
      name: "Classic White Tee",
      price: 190,
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop",
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

  const handleLoginSuccess = async (email) => {
    setIsLoggedIn(true);
    await sendLoginToDiscord(email);
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
              <Login
                setIsLoggedIn={setIsLoggedIn}
                onLoginSuccess={handleLoginSuccess}
              />
            )
          }
        />

        <Route
          path="/home"
          element={
            isLoggedIn ? (
              <Home
                products={products}
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

      </Routes>
    </BrowserRouter>
  );
}