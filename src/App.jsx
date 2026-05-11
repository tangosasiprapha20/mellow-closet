import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Cart from "./pages/Cart.jsx";
import Login from "./pages/Login.jsx";
import Checkout from "./pages/Checkout.jsx";

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

export default function App() {
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

    // ✅ เพิ่มเลขออเดอร์อัตโนมัติ
    setOrderId((prev) => prev + 1);

    setCart([]);
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

      </Routes>
    </BrowserRouter>
  );
}