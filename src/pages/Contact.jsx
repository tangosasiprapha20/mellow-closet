import { Link } from "react-router-dom";

const contacts = [
  {
    label: "Instagram",
    icon: "—",
    value: "@softlane",
    href: "https://www.instagram.com/3rdtango?igsh=d3I2eDRjNGNoeG93&utm_source=qr",
  },
  {
    label: "Line",
    icon: "—",
    value: "@softlane",
    href: "https://line.me/ti/p/ZcosbJ4QOQ",
  },
  {
    label: "โทรศัพท์",
    icon: "—",
    value: "097-958-9118",
    href: "tel:0979589118",
  },
];

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#fafafa] px-5 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="border border-neutral-200 bg-white p-8 md:p-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-400">
            Contact
          </p>
          <h1 className="mt-4 text-2xl font-light tracking-tight text-neutral-900 md:text-3xl">
            ติดต่อเรา
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-neutral-500 md:text-base">
            สอบถามไซส์ สต็อก และการจัดส่ง — ทีมงานตอบตามลำดับข้อความ
          </p>
        </div>

        <div className="mt-8 grid gap-px bg-neutral-200 sm:grid-cols-3">
          {contacts.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noreferrer" : undefined}
              className="group flex flex-col bg-white p-6 transition hover:bg-neutral-50"
            >
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">
                {item.label}
              </p>
              <p className="mt-4 text-sm font-medium text-neutral-900 group-hover:underline">
                {item.value}
              </p>
            </a>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3 border border-neutral-200 bg-white p-6">
          <Link
            to="/home"
            className="inline-flex min-w-[8rem] flex-1 items-center justify-center border border-neutral-900 bg-neutral-900 px-5 py-2.5 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-neutral-900 sm:flex-none"
          >
            หน้าแรก
          </Link>
          <Link
            to="/cart"
            className="inline-flex min-w-[8rem] flex-1 items-center justify-center border border-neutral-200 bg-white px-5 py-2.5 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-800 transition hover:border-neutral-900 sm:flex-none"
          >
            ตะกร้า
          </Link>
          <Link
            to="/about"
            className="inline-flex min-w-[8rem] flex-1 items-center justify-center border border-neutral-200 bg-white px-5 py-2.5 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-800 transition hover:border-neutral-900 sm:flex-none"
          >
            เกี่ยวกับเรา
          </Link>
        </div>
      </div>
    </div>
  );
}
