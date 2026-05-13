export default function Login({ setIsLoggedIn = () => {} }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fafafa] px-5 py-16">
      <div className="w-full max-w-sm border border-neutral-200 bg-white p-10 text-center md:p-12">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-neutral-400">
          Softlane
        </p>
        <h1 className="mt-6 text-2xl font-light tracking-tight text-neutral-900 md:text-3xl">
          กดเพื่อเลือกซื้อสินค้า
        </h1>
        <p className="mt-5 text-sm leading-relaxed text-neutral-500">
          ร้านเสื้อผ้าโทนมินิมอล ไม่ต้องล็อกอิน
        </p>
        <button
          type="button"
          onClick={() => setIsLoggedIn(true)}
          className="mt-10 w-full border border-neutral-900 bg-neutral-900 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-neutral-900"
        >
          เข้าสู่ร้าน
        </button>
      </div>
    </div>
  );
}
