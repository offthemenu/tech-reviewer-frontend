import { useState } from "react";

export default function ProtectedApp({ children }: { children: React.ReactNode }) {
  const [entered, setEntered] = useState(false);
  const [input, setInput] = useState("");

  const checkPassword = () => {
    if (input === import.meta.env.VITE_APP_ACCESS_PASSWORD) {
      setEntered(true);
    } else {
      alert("Incorrect password");
    }
  };

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
