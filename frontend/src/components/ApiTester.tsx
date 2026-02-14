import React, { useState } from "react";
import { Play, Copy, RotateCcw } from "lucide-react";
import { useTheme } from "../ThemeContext";

interface HeaderItem {
  key: string;
  value: string;
}

const ApiTester: React.FC = () => {
  const { theme } = useTheme();
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/posts/1");
  const [method, setMethod] = useState("GET");
  const [headers, setHeaders] = useState<HeaderItem[]>([
    { key: "Content-Type", value: "application/json" },
  ]);
  const [body, setBody] = useState("");
  const [response, setResponse] = useState("");
  const [status, setStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [responseTime, setResponseTime] = useState(0);

  const addHeader = () =>
    setHeaders((prev) => [...prev, { key: "", value: "" }]);

  const updateHeader = (i: number, field: "key" | "value", val: string) => {
    setHeaders((prev) =>
      prev.map((h, index) => (index === i ? { ...h, [field]: val } : h))
    );
  };

  const removeHeader = (i: number) =>
    setHeaders((prev) => prev.filter((_, index) => index !== i));

  const makeRequest = async () => {
    if (!url.trim()) return;
    setLoading(true);
    const start = performance.now();

    try {
      const headerObj: Record<string, string> = {};
      headers.forEach((h) => {
        if (h.key.trim()) headerObj[h.key] = h.value;
      });

      const res = await fetch(url, {
        method,
        headers: headerObj,
        body: ["POST", "PUT", "PATCH"].includes(method) ? body : undefined,
      });

      const end = performance.now();
      setStatus(res.status);
      setResponseTime(Math.round(end - start));

      const text = await res.text();
      try {
        setResponse(JSON.stringify(JSON.parse(text), null, 2));
      } catch {
        setResponse(text);
      }
    } catch {
      setResponse("Request Failed");
      setStatus(null);
    }

    setLoading(false);
  };

  const copyResponse = () => navigator.clipboard.writeText(response);

  const reset = () => {
    setUrl("");
    setMethod("GET");
    setHeaders([{ key: "Content-Type", value: "application/json" }]);
    setBody("");
    setResponse("");
    setStatus(null);
    setResponseTime(0);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 dark:text-white">API Tester</h1>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* REQUEST PANEL */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow border border-slate-200 dark:border-slate-700 p-4 sm:p-6 space-y-4">

          {/* URL ROW FIXED */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 sm:w-32 w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              >
                {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>

              <input
                className="flex-1 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter API URL"
              />
            </div>

            <button
              onClick={makeRequest}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2 w-full transition-colors"
            >
              <Play size={16} />
              {loading ? "Sending..." : "Send Request"}
            </button>
          </div>

          {/* Headers */}
          <div>
            <div className="flex justify-between mb-2">
              <h3 className="font-semibold text-slate-900 dark:text-white">Headers</h3>
              <button onClick={addHeader} className="text-indigo-600 dark:text-indigo-400 text-sm hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                + Add Header
              </button>
            </div>

            {headers.map((h, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-2 mb-2">
                <input
                  value={h.key}
                  onChange={(e) => updateHeader(i, "key", e.target.value)}
                  className="border border-slate-200 dark:border-slate-600 rounded px-2 py-2 flex-1 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="Key"
                />
                <input
                  value={h.value}
                  onChange={(e) => updateHeader(i, "value", e.target.value)}
                  className="border border-slate-200 dark:border-slate-600 rounded px-2 py-2 flex-1 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="Value"
                />
                <button onClick={() => removeHeader(i)} className="px-2 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors">
                  ×
                </button>
              </div>
            ))}
          </div>

          <textarea
            className="w-full min-h-[150px] border border-slate-200 dark:border-slate-600 rounded-lg p-2 font-mono bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Request Body"
          />

          <button
            onClick={reset}
            className="w-full border border-slate-200 dark:border-slate-600 py-2 rounded-lg flex justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>

        {/* RESPONSE PANEL */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow border border-slate-200 dark:border-slate-700 p-4 sm:p-6 space-y-3">
          <div className="flex justify-between">
            <h3 className="font-semibold text-slate-900 dark:text-white">Response</h3>
            {response && (
              <button onClick={copyResponse} className="text-sm flex gap-1 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                <Copy size={14} /> Copy
              </button>
            )}
          </div>

          {status !== null && (
            <div className="border border-slate-200 dark:border-slate-600 rounded-lg p-3 text-sm bg-slate-50 dark:bg-slate-700">
              <div className="text-slate-900 dark:text-white">Status: {status}</div>
              <div className="text-slate-900 dark:text-white">Time: {responseTime} ms</div>
            </div>
          )}

          <pre className="w-full min-h-[250px] max-h-[500px] overflow-auto border border-slate-200 dark:border-slate-600 rounded-lg p-3 text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white">
            {response}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ApiTester;
