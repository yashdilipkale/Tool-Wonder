import React, { useState, useRef } from "react";
import { Lock, Unlock, Upload, Download, AlertTriangle, Key } from "lucide-react";
import { useTheme } from "../ThemeContext";

const FileEncryption: React.FC = () => {
  const { theme } = useTheme();
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  /* ---------- FIXED KEY GENERATION ---------- */
  const getKeyFromPassword = async (
    password: string,
    salt: Uint8Array
  ): Promise<CryptoKey> => {
    const enc = new TextEncoder();

    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      "PBKDF2",
      false,
      ["deriveKey"]
    );

    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt.buffer.slice(
          salt.byteOffset,
          salt.byteOffset + salt.byteLength
        ) as ArrayBuffer,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  };

  /* ---------- ENCRYPT ---------- */
  const encryptFile = async (file: File, password: string) => {
    const data = await file.arrayBuffer();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const key = await getKeyFromPassword(password, salt);

    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );

    const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
    combined.set(salt);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(encrypted), salt.length + iv.length);

    return new Blob([combined]);
  };

  /* ---------- DECRYPT ---------- */
  const decryptFile = async (file: File, password: string) => {
    const buffer = new Uint8Array(await file.arrayBuffer());

    const salt = buffer.slice(0, 16);
    const iv = buffer.slice(16, 28);
    const data = buffer.slice(28);

    const key = await getKeyFromPassword(password, salt);

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );

    return new Blob([decrypted]);
  };

  /* ---------- PROCESS ---------- */
  const processFile = async () => {
    if (!file || !password) return;
    setLoading(true);
    setResult(null);

    try {
      const blob =
        mode === "encrypt"
          ? await encryptFile(file, password)
          : await decryptFile(file, password);

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        mode === "encrypt"
          ? `${file.name}.encrypted`
          : file.name.replace(".encrypted", "");

      a.click();
      URL.revokeObjectURL(url);

      setResult("Completed successfully");
    } catch {
      setResult("Incorrect password or corrupted file");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">File Encryption Tool</h2>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode("encrypt")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            mode === "encrypt" 
              ? "bg-blue-600 text-white" 
              : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600"
          }`}
        >
          Encrypt
        </button>
        <button
          onClick={() => setMode("decrypt")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            mode === "decrypt" 
              ? "bg-blue-600 text-white" 
              : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600"
          }`}
        >
          Decrypt
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white mb-4"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white mb-4"
      />

      <button
        onClick={processFile}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors"
      >
        {loading ? "Processing..." : mode === "encrypt" ? "Encrypt File" : "Decrypt File"}
      </button>

      {result && (
        <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-300">
          {result}
        </p>
      )}
    </div>
  );
};

export default FileEncryption;
