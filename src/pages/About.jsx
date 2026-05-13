import { Link } from "react-router-dom";
import imgShowcase from "../assets/รูปโชว์.jpg";

const IMG_FALLBACK = imgShowcase;

const steps = [
  {
    n: 1,
    title: "เลือกสินค้า",
    body: "ที่หน้าแรกมีทั้งสินค้าพร้อมส่งและโซน «กำลังจะมา» — กดเพิ่มลงตะกร้าเฉพาะรายการที่พร้อมจำหน่าย",
  },
  {
    n: 2,
    title: "ตรวจตะกร้า",
    body: "ตรวจรายการและยอดรวม ลบรายการที่ไม่ต้องการได้ หากอยากเพิ่มชิ้นกลับไปที่หน้าแรก",
  },
  {
    n: 3,
    title: "ชำระเงิน",
    body: "กรอกชื่อ เบอร์โทร และที่อยู่ จากนั้นเปิด QR พร้อมเพย์ โอนแล้วแจ้งสลิปทาง Line หรือ Instagram",
  },
  {
    n: 4,
    title: "ติดตามคำสั่งซื้อ",
    body: "ดูประวัติได้ที่เมนูคำสั่งซื้อ หากต้องการสอบถามหรือจองล่วงหน้า ใช้หน้าติดต่อเรา",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-[#fafafa] px-5 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="border border-neutral-200 bg-white p-8 md:p-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-400">
            About
          </p>
          <h1 className="mt-4 text-2xl font-light tracking-tight text-neutral-900 md:text-3xl">
            เกี่ยวกับเรา
          </h1>
          <p className="mt-6 text-sm leading-relaxed text-neutral-600 md:text-base">
            <span className="font-medium text-neutral-900">Mellow-Closet</span>{" "}
            คือร้านเสื้อผ้าแนวมินิมอล เน้นสีโทนเนียร์ทรัลและผ้าที่สัมผัสสบาย
            คัดทรงที่ใส่ได้จริงในชีวิตประจำวัน ให้ตู้เสื้อผ้าดูสะอาดและใช้งานง่าย
          </p>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600 md:text-base">
            หากสนใจไลน์ในโซน «กำลังจะมา» แจ้งทางช่องทางติดต่อได้
            เราจะแจ้งเมื่อสินค้าเข้าหรือช่วยจองล่วงหน้า
          </p>
          <div className="mt-8 overflow-hidden border border-neutral-100 bg-neutral-50">
            <img
              src={IMG_FALLBACK}
              alt="สไตล์เสื้อผ้า Mellow-Closet"
              loading="lazy"
              className="aspect-[16/9] w-full object-cover md:aspect-[2/1]"
            />
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-lg font-normal text-neutral-900 md:text-xl">
            วิธีใช้งานเว็บ
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            ขั้นตอนสั้นๆ สำหรับการสั่งซื้อ
          </p>
          <ol className="mt-8 space-y-0 divide-y divide-neutral-200 border border-neutral-200 bg-white">
            {steps.map((s) => (
              <li key={s.n} className="flex gap-5 p-5 md:p-6">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center border border-neutral-200 text-xs font-medium text-neutral-600"
                  aria-hidden
                >
                  {s.n}
                </span>
                <div>
                  <h3 className="text-sm font-medium text-neutral-900">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-10 flex flex-wrap gap-3 border border-neutral-200 bg-white p-6">
          <Link
            to="/home"
            className="inline-flex min-w-[8rem] flex-1 items-center justify-center border border-neutral-900 bg-neutral-900 px-5 py-2.5 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-neutral-900 sm:flex-none"
          >
            หน้าแรก
          </Link>
          <Link
            to="/contact"
            className="inline-flex min-w-[8rem] flex-1 items-center justify-center border border-neutral-200 bg-white px-5 py-2.5 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-800 transition hover:border-neutral-900 sm:flex-none"
          >
            ติดต่อเรา
          </Link>
        </div>
      </div>
    </div>
  );
}
