import { useEffect, useState } from "react";

const STORAGE_KEY = "wa-reviewer-auth";

export default function ProtectedApp({ children }: { children: React.ReactNode }) {
  const [input, setInput] = useState("");
  const [entered, setEntered] = useState(false);

  const checkPassword = () => {
    if (input === import.meta.env.VITE_APP_ACCESS_PASSWORD) {
      const expiry = Date.now() + 60 * 60 * 1000; // 1 hour
      localStorage.setItem(STORAGE_KEY, expiry.toString());
      setEntered(true);
    } else {
      alert("Incorrect password");
    }
  };

  useEffect(() => {
    const expiry = localStorage.getItem(STORAGE_KEY);
    if (expiry && Date.now() < parseInt(expiry)) {
      setEntered(true);
    }
  }, []);

  if (entered) return <>{children}</>;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "20vh" }}>
      <h2>🔒 Protected Sign-In</h2>
      <input
        type="password"
        placeholder="Enter password"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ padding: "8px", fontSize: "1rem", marginBottom: "12px" }}
      />
      <button onClick={checkPassword} style={{ padding: "8px 16px" }}>
        Enter
      </button>
    </div>
  );
}
