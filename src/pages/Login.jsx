import { useState } from "react";

export default function Login({ setIsLoggedIn = () => {} }) {
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-200/80 via-zinc-100 to-zinc-50 px-5 py-12 text-left">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200/80 bg-white p-8 shadow-xl shadow-zinc-900/5 md:p-10">
        
        <h1 className="text-2xl font-semibold text-center mb-6">
          {isSignup ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
        </h1>

        <div className="space-y-4">
          {isSignup && (
            <input
              type="text"
              placeholder="ชื่อเต็ม"
              className="w-full border p-3 rounded-xl"
            />
          )}

          <input
            type="email"
            placeholder="อีเมล"
            className="w-full border p-3 rounded-xl"
          />

          <input
            type="password"
            placeholder="รหัสผ่าน"
            className="w-full border p-3 rounded-xl"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-black text-white p-3 rounded-xl"
        >
          {isSignup ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
        </button>

        <p className="text-center mt-6 text-sm">
          <button onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? "มีบัญชีแล้ว" : "สมัครสมาชิก"}
          </button>
        </p>
      </div>
    </div>
  );
}