import React, { useState } from "react";
import { Copy, Plus, Trash2 } from "lucide-react";
import { useTheme } from "../ThemeContext";

interface Condition {
  field: string;
  operator: string;
  value: string;
}

const tables = {
  users: ["id", "name", "email", "age", "created_at"],
  orders: ["id", "user_id", "amount", "status", "created_at"],
  products: ["id", "title", "price", "stock", "category"],
};

const operators = ["=", "!=", ">", "<", ">=", "<=", "LIKE"];

const DatabaseQueryBuilder: React.FC = () => {
  const { theme } = useTheme();
  const [selectedTable, setSelectedTable] = useState("users");
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [copied, setCopied] = useState(false);

  const toggleColumn = (column: string) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns(selectedColumns.filter((c) => c !== column));
    } else {
      setSelectedColumns([...selectedColumns, column]);
    }
  };

  const addCondition = () => {
    setConditions([...conditions, { field: "", operator: "=", value: "" }]);
  };

  const removeCondition = (index: number) => {
    const updated = [...conditions];
    updated.splice(index, 1);
    setConditions(updated);
  };

  const updateCondition = (
    index: number,
    key: keyof Condition,
    value: string
  ) => {
    const updated = [...conditions];
    updated[index][key] = value;
    setConditions(updated);
  };

  const generateSQL = () => {
    const cols = selectedColumns.length
      ? selectedColumns.join(", ")
      : "*";

    let query = `SELECT ${cols} FROM ${selectedTable}`;

    if (conditions.length > 0) {
      const whereClause = conditions
        .filter((c) => c.field && c.value)
        .map(
          (c) =>
            `${c.field} ${c.operator} ${
              c.operator === "LIKE"
                ? `'%${c.value}%'`
                : `'${c.value}'`
            }`
        )
        .join(" AND ");

      if (whereClause) {
        query += ` WHERE ${whereClause}`;
      }
    }

    return query + ";";
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateSQL());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white">
        Database Query Builder
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT PANEL */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="font-semibold text-slate-900 dark:text-white">1. Select Table</h3>

          <select
            value={selectedTable}
            onChange={(e) => {
              setSelectedTable(e.target.value);
              setSelectedColumns([]);
              setConditions([]);
            }}
            className="w-full border border-slate-200 dark:border-slate-600 rounded-lg p-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          >
            {Object.keys(tables).map((table) => (
              <option key={table}>{table}</option>
            ))}
          </select>

          <h3 className="font-semibold mt-4 text-slate-900 dark:text-white">2. Select Columns</h3>

          <div className="flex flex-wrap gap-2">
            {tables[selectedTable as keyof typeof tables].map((col) => (
              <button
                key={col}
                onClick={() => toggleColumn(col)}
                className={`px-3 py-1 rounded-full text-sm border border-slate-200 dark:border-slate-600 transition ${
                  selectedColumns.includes(col)
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
              >
                {col}
              </button>
            ))}
          </div>
        </div>

        {/* MIDDLE PANEL */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="font-semibold flex justify-between items-center text-slate-900 dark:text-white">
            3. Conditions
            <button
              onClick={addCondition}
              className="flex items-center gap-1 text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={14} /> Add
            </button>
          </h3>

          {conditions.map((cond, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 border border-slate-200 dark:border-slate-600 p-3 rounded-lg"
            >
              <select
                value={cond.field}
                onChange={(e) =>
                  updateCondition(index, "field", e.target.value)
                }
                className="border border-slate-200 dark:border-slate-600 p-2 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              >
                <option value="">Select field</option>
                {tables[selectedTable as keyof typeof tables].map(
                  (col) => (
                    <option key={col}>{col}</option>
                  )
                )}
              </select>

              <select
                value={cond.operator}
                onChange={(e) =>
                  updateCondition(index, "operator", e.target.value)
                }
                className="border border-slate-200 dark:border-slate-600 p-2 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              >
                {operators.map((op) => (
                  <option key={op}>{op}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Value"
                value={cond.value}
                onChange={(e) =>
                  updateCondition(index, "value", e.target.value)
                }
                className="border border-slate-200 dark:border-slate-600 p-2 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />

              <button
                onClick={() => removeCondition(index)}
                className="text-red-500 dark:text-red-400 flex items-center gap-1 text-sm hover:text-red-700 dark:hover:text-red-300 transition-colors"
              >
                <Trash2 size={14} /> Remove
              </button>
            </div>
          ))}
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="font-semibold text-slate-900 dark:text-white">4. Generated SQL</h3>

          <pre className="bg-black text-green-400 p-4 rounded-xl text-sm overflow-x-auto">
{generateSQL()}
          </pre>

          <button
            onClick={handleCopy}
            className="w-full bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
          >
            <Copy size={16} />
            {copied ? "Copied!" : "Copy Query"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatabaseQueryBuilder;
