import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import imgShowcase from "../assets/รูปโชว์.jpg";

const IMG_FALLBACK = imgShowcase;

const navLink =
  "text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500 transition hover:text-neutral-900";

export default function Home({
  products = [],
  comingSoon = [],
  addToCart = () => {},
  cart = [],
  setIsLoggedIn = () => {},
}) {
  const heroSrc =
    Array.isArray(products) && products[0]?.image
      ? products[0].image
      : IMG_FALLBACK;

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 antialiased">
      <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-[#fafafa]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <Link
            to="/home"
            className="text-sm font-medium tracking-[0.25em] text-neutral-900"
          >
            MELLOW-CLOSET
          </Link>

          <nav className="flex flex-wrap items-center justify-end gap-x-5 gap-y-2 md:gap-x-8">
            <a href="#soon" className={navLink}>
              ใหม่
            </a>
            <a href="#collection" className={navLink}>
              สินค้า
            </a>
            <Link to="/orders" className={navLink}>
              คำสั่งซื้อ
            </Link>
            <Link to="/about" className={navLink}>
              เกี่ยวกับ
            </Link>
            <Link to="/contact" className={navLink}>
              ติดต่อ
            </Link>
            <button
              type="button"
              onClick={() => setIsLoggedIn(false)}
              className={navLink}
            >
              ออก
            </button>
            <Link
              to="/cart"
              className="relative -mr-1 p-1.5 text-neutral-700 hover:text-neutral-900"
              aria-label="ตะกร้า"
            >
              <ShoppingCart className="h-5 w-5 stroke-[1.25]" />
              {(cart?.length || 0) > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-neutral-900 px-1 text-[10px] font-medium text-white">
                  {cart?.length}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero — โครงใหม่: ซ้ายคำพูด / ขวารูปเต็มความสูง */}
        <section className="border-b border-neutral-200/60">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-2 md:items-center md:gap-16 md:px-8 md:py-20 lg:py-24">
            <div className="order-2 md:order-1">
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-neutral-400">
                Spring / Summer
              </p>
              <h1 className="mt-4 text-4xl font-light leading-[1.1] tracking-tight text-neutral-900 md:text-5xl lg:text-[3.25rem]">
                เสื้อผ้า
                <br />
                <span className="text-neutral-400">เรียบ สะอาด</span>
              </h1>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-neutral-500 md:text-base">
                คอลเลกชันมินิมอล เน้นผ้าและทรงที่ใส่ได้ทุกวัน โทนสีเนียร์ทรัลให้ดูสะอาดตา
              </p>
              <a
                href="#collection"
                className="mt-10 inline-block border border-neutral-900 bg-neutral-900 px-8 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-transparent hover:text-neutral-900"
              >
                เลือกชมสินค้า
              </a>
            </div>
            <div className="order-1 md:order-2">
              <div className="aspect-[3/4] w-full overflow-hidden bg-neutral-100 md:aspect-[4/5]">
                <img
                  src={heroSrc}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Coming soon — แถบแนวนอน + การ์ดบาง */}
        {Array.isArray(comingSoon) && comingSoon.length > 0 && (
          <section
            id="soon"
            className="border-b border-neutral-200/60 bg-white"
            aria-labelledby="soon-heading"
          >
            <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-16">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2
                    id="soon-heading"
                    className="text-lg font-normal tracking-tight text-neutral-900 md:text-xl"
                  >
                    กำลังจะมา
                  </h2>
                  <p className="mt-1 max-w-md text-sm text-neutral-500">
                    ไลน์ใหม่ที่กำลังเตรียมเข้า — สอบถามหรือจองล่วงหน้าได้ที่ติดต่อเรา
                  </p>
                </div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-400">
                  Soon
                </p>
              </div>

              <div className="mt-10 flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 md:gap-6">
                {comingSoon.map((item) => (
                  <article
                    key={item.id}
                    className="w-[72vw] shrink-0 border border-neutral-200/80 bg-[#fafafa] md:w-auto"
                  >
                    <div className="aspect-[3/4] overflow-hidden bg-neutral-100">
                      <img
                        src={item.image || IMG_FALLBACK}
                        alt={item.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="border-t border-neutral-200/80 p-4">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                        {item.eta}
                      </p>
                      <h3 className="mt-1 text-sm font-medium text-neutral-900">
                        {item.name}
                      </h3>
                      {item.teaser && (
                        <p className="mt-1 text-xs leading-relaxed text-neutral-500">
                          {item.teaser}
                        </p>
                      )}
                      <p className="mt-3 text-[10px] uppercase tracking-wider text-neutral-400">
                        ยังไม่พร้อมสั่งซื้อ
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Collection — กริดกว้าง มินิมอล */}
        <section
          id="collection"
          className="scroll-mt-20"
          aria-labelledby="collection-heading"
        >
          <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
            <h2
              id="collection-heading"
              className="text-lg font-normal tracking-tight text-neutral-900 md:text-xl"
            >
              สินค้าทั้งหมด
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              ราคาเป็นสกุลเงินบาท — กดเพิ่มลงตะกร้าได้ทันที
            </p>

            {Array.isArray(products) && products.length > 0 ? (
              <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4">
                {products.map((product) => (
                  <li key={product.id} className="group">
                    <div className="aspect-[3/4] overflow-hidden bg-neutral-100">
                      <img
                        src={product.image || IMG_FALLBACK}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                      />
                    </div>
                    <div className="mt-3 space-y-1">
                      <h3 className="text-sm font-medium leading-snug text-neutral-900">
                        {product.name}
                      </h3>
                      <p className="text-sm tabular-nums text-neutral-500">
                        ฿{Number(product.price).toLocaleString("th-TH")}
                      </p>
                      <button
                        type="button"
                        onClick={() => addToCart(product)}
                        className="mt-2 text-left text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-900 underline decoration-neutral-300 underline-offset-4 transition hover:decoration-neutral-900"
                      >
                        เพิ่มลงตะกร้า
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-12 text-center text-sm text-neutral-500">
                ไม่มีสินค้า
              </p>
            )}
          </div>
        </section>

        <footer className="border-t border-neutral-200/80 py-8 text-center">
          <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-400">
            Mellow-Closet — minimal wardrobe
          </p>
        </footer>
      </main>
    </div>
  );
}
