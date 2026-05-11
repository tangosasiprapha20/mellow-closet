import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home({
  products = [],
  addToCart = () => {},
  cart = [],
  setIsLoggedIn = () => {},
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 via-zinc-50 to-zinc-100 text-left">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/75 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
          <Link to="/home" className="text-xl font-semibold text-zinc-900">
            Mellow Closet
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLoggedIn(false)}
              className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100"
            >
              ออกจากระบบ
            </button>

            <Link to="/cart" className="relative p-2">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 text-xs bg-black text-white rounded-full px-1">
                {cart?.length || 0}
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="mx-auto max-w-6xl px-5 py-10">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Second Hand Collection
        </h1>

        {/* กัน products พัง */}
        {Array.isArray(products) && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-64 w-full object-cover"
                />

                <div className="p-4">
                  <h2 className="font-semibold text-lg">{product.name}</h2>
                  <p className="text-zinc-500 text-sm">มือสองคุณภาพดี</p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="font-bold">฿{product.price}</span>

                    <button
                      onClick={() => addToCart(product)}
                      className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-zinc-800"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-zinc-500">
            ไม่มีสินค้า (products ว่าง)
          </p>
        )}
      </main>
    </div>
  );
}