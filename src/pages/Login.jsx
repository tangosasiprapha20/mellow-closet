import { useState } from "react";

export default function Login({
  setIsLoggedIn = () => {},
  onLoginSuccess = null,
}) {
  const [isSignup, setIsSignup] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignup && !fullName.trim()) {
      setErrorMessage("กรุณากรอกชื่อเต็ม");
      return;
    }
    if (!email.trim()) {
      setErrorMessage("กรุณากรอกอีเมล");
      return;
    }
    if (!password.trim()) {
      setErrorMessage("กรุณากรอกรหัสผ่าน");
      return;
    }

    setErrorMessage("");
    if (onLoginSuccess) {
      await onLoginSuccess(email.trim());
    } else {
      setIsLoggedIn(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-200/80 via-zinc-100 to-zinc-50 px-5 py-12 text-left">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200/80 bg-white p-8 shadow-xl shadow-zinc-900/5 md:p-10">
        
        <h1 className="text-2xl font-semibold text-center mb-6">
          {isSignup ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {isSignup && (
              <input
                type="text"
                placeholder="ชื่อเต็ม"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border p-3 rounded-xl"
              />
            )}

            <input
              type="email"
              placeholder="อีเมล"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-3 rounded-xl"
            />

            <input
              type="password"
              placeholder="รหัสผ่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-3 rounded-xl"
            />
          </div>

          {errorMessage && (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            className="mt-6 w-full bg-black text-white p-3 rounded-xl"
          >
            {isSignup ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm">
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setErrorMessage("");
            }}
          >
            {isSignup ? "มีบัญชีแล้ว" : "สมัครสมาชิก"}
          </button>
        </p>
      </div>
    </div>
  );
}