import { Link } from "react-router-dom";

const contacts = [
  {
    label: "Instagram",
    icon: "📸",
    value: "@mellow.closet",
    href: "https://www.instagram.com/3rdtango?igsh=d3I2eDRjNGNoeG93&utm_source=qr",
  },
  {
    label: "Line",
    icon: "💬",
    value: "@mellowcloset",
    href: "https://line.me/ti/p/ZcosbJ4QOQ",
  },
  {
    label: "โทรศัพท์",
    icon: "📞",
    value: "097-958-9118",
    href: "tel:0979589118",
  },
];

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 via-zinc-50 to-zinc-100 px-5 py-10 md:px-8 md:py-14">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm md:p-8">
          <p className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
            Contact & Social
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
            ช่องทางการติดต่อ
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600 md:text-base">
            สอบถามสินค้า สต็อก และรายละเอียดการจัดส่งได้ทุกช่องทางด้านล่าง
            ทางร้านตอบกลับตามลำดับคิวข้อความ
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contacts.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noreferrer" : undefined}
              className="group rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{item.icon}</span>
                <p className="text-sm font-medium text-zinc-600">{item.label}</p>
              </div>
              <div className="mt-3 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2">
                <p className="text-base font-semibold text-zinc-900 group-hover:text-zinc-700">
                  {item.value}
                </p>
              </div>
              
            </a>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm md:p-6">
          <p className="text-sm font-medium text-zinc-600">กลุ่มย้อนกลับ</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/home"
              className="inline-flex min-w-36 items-center justify-center rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              กลับหน้าแรก
            </Link>
            <Link
              to="/cart"
              className="inline-flex min-w-36 items-center justify-center rounded-xl border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50"
            >
              ไปตะกร้าสินค้า
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

