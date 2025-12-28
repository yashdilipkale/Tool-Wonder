import React, { useState, useEffect } from 'react';
import { Brackets, Play, Copy, RotateCcw, Plus, Minus, Database, Table, Columns, Filter, SortAsc } from 'lucide-react';

interface Table {
  id: string;
  name: string;
  columns: Column[];
}

interface Column {
  id: string;
  name: string;
  type: string;
  nullable: boolean;
}

interface SelectedColumn {
  tableId: string;
  columnId: string;
  alias?: string;
}

interface Join {
  id: string;
  leftTable: string;
  rightTable: string;
  leftColumn: string;
  rightColumn: string;
  type: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL OUTER';
}

interface WhereCondition {
  id: string;
  column: string;
  operator: string;
  value: string;
  logic: 'AND' | 'OR';
}

interface OrderBy {
  column: string;
  direction: 'ASC' | 'DESC';
}

const DatabaseQueryBuilder: React.FC = () => {
  const [databaseType, setDatabaseType] = useState<string>('mysql');
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<SelectedColumn[]>([]);
  const [joins, setJoins] = useState<Join[]>([]);
  const [whereConditions, setWhereConditions] = useState<WhereCondition[]>([]);
  const [groupByColumns, setGroupByColumns] = useState<string[]>([]);
  const [orderByColumns, setOrderByColumns] = useState<OrderBy[]>([]);
  const [limit, setLimit] = useState<number | null>(null);
  const [generatedQuery, setGeneratedQuery] = useState<string>('');

  // Sample database schema
  useEffect(() => {
    const sampleTables: Table[] = [
      {
        id: 'users',
        name: 'users',
        columns: [
          { id: 'id', name: 'id', type: 'INT', nullable: false },
          { id: 'name', name: 'name', type: 'VARCHAR(255)', nullable: false },
          { id: 'email', name: 'email', type: 'VARCHAR(255)', nullable: false },
          { id: 'created_at', name: 'created_at', type: 'DATETIME', nullable: false },
          { id: 'status', name: 'status', type: 'ENUM', nullable: false }
        ]
      },
      {
        id: 'orders',
        name: 'orders',
        columns: [
          { id: 'id', name: 'id', type: 'INT', nullable: false },
          { id: 'user_id', name: 'user_id', type: 'INT', nullable: false },
          { id: 'total', name: 'total', type: 'DECIMAL(10,2)', nullable: false },
          { id: 'status', name: 'status', type: 'VARCHAR(50)', nullable: false },
          { id: 'created_at', name: 'created_at', type: 'DATETIME', nullable: false }
        ]
      },
      {
        id: 'products',
        name: 'products',
        columns: [
          { id: 'id', name: 'id', type: 'INT', nullable: false },
          { id: 'name', name: 'name', type: 'VARCHAR(255)', nullable: false },
          { id: 'price', name: 'price', type: 'DECIMAL(10,2)', nullable: false },
          { id: 'category', name: 'category', type: 'VARCHAR(100)', nullable: true },
          { id: 'stock_quantity', name: 'stock_quantity', type: 'INT', nullable: false }
        ]
      },
      {
        id: 'order_items',
        name: 'order_items',
        columns: [
          { id: 'id', name: 'id', type: 'INT', nullable: false },
          { id: 'order_id', name: 'order_id', type: 'INT', nullable: false },
          { id: 'product_id', name: 'product_id', type: 'INT', nullable: false },
          { id: 'quantity', name: 'quantity', type: 'INT', nullable: false },
          { id: 'price', name: 'price', type: 'DECIMAL(10,2)', nullable: false }
        ]
      }
    ];
    setTables(sampleTables);
  }, []);

  const addTable = (tableId: string) => {
    if (!selectedTables.includes(tableId)) {
      setSelectedTables([...selectedTables, tableId]);
    }
  };

  const removeTable = (tableId: string) => {
    setSelectedTables(selectedTables.filter(id => id !== tableId));
    setSelectedColumns(selectedColumns.filter(col => col.tableId !== tableId));
    setJoins(joins.filter(join => join.leftTable !== tableId && join.rightTable !== tableId));
  };

  const addColumn = (tableId: string, columnId: string) => {
    if (!selectedColumns.some(col => col.tableId === tableId && col.columnId === columnId)) {
      setSelectedColumns([...selectedColumns, { tableId, columnId }]);
    }
  };

  const removeColumn = (tableId: string, columnId: string) => {
    setSelectedColumns(selectedColumns.filter(col => !(col.tableId === tableId && col.columnId === columnId)));
  };

  const addJoin = () => {
    const newJoin: Join = {
      id: `join-${Date.now()}`,
      leftTable: selectedTables[0] || '',
      rightTable: selectedTables[1] || '',
      leftColumn: '',
      rightColumn: '',
      type: 'INNER'
    };
    setJoins([...joins, newJoin]);
  };

  const removeJoin = (joinId: string) => {
    setJoins(joins.filter(join => join.id !== joinId));
  };

  const addWhereCondition = () => {
    const newCondition: WhereCondition = {
      id: `where-${Date.now()}`,
      column: '',
      operator: '=',
      value: '',
      logic: 'AND'
    };
    setWhereConditions([...whereConditions, newCondition]);
  };

  const removeWhereCondition = (conditionId: string) => {
    setWhereConditions(whereConditions.filter(cond => cond.id !== conditionId));
  };

  const addOrderBy = () => {
    setOrderByColumns([...orderByColumns, { column: '', direction: 'ASC' }]);
  };

  const removeOrderBy = (index: number) => {
    setOrderByColumns(orderByColumns.filter((_, i) => i !== index));
  };

  const generateSQL = () => {
    if (selectedColumns.length === 0) return 'SELECT * FROM table_name';

    let query = 'SELECT\n';

    // SELECT clause
    const selectColumns = selectedColumns.map(col => {
      const table = tables.find(t => t.id === col.tableId);
      const column = table?.columns.find(c => c.id === col.columnId);
      if (table && column) {
        const fullName = selectedTables.length > 1 ? `${table.name}.${column.name}` : column.name;
        return col.alias ? `${fullName} AS ${col.alias}` : fullName;
      }
      return '';
    }).filter(Boolean);

    query += '  ' + selectColumns.join(',\n  ') + '\n';

    // FROM clause
    query += 'FROM\n';
    const fromTables = selectedTables.map(tableId => {
      const table = tables.find(t => t.id === tableId);
      return table ? table.name : tableId;
    });
    query += '  ' + fromTables.join(',\n  ') + '\n';

    // JOIN clauses
    joins.forEach(join => {
      const leftTable = tables.find(t => t.id === join.leftTable);
      const rightTable = tables.find(t => t.id === join.rightTable);
      if (leftTable && rightTable) {
        query += `${join.type} JOIN ${rightTable.name} ON ${leftTable.name}.${join.leftColumn} = ${rightTable.name}.${join.rightColumn}\n`;
      }
    });

    // WHERE clause
    if (whereConditions.length > 0) {
      query += 'WHERE\n';
      const whereClauses = whereConditions.map((condition, index) => {
        const logic = index > 0 ? ` ${condition.logic} ` : '';
        return `${logic}${condition.column} ${condition.operator} '${condition.value}'`;
      });
      query += '  ' + whereClauses.join('\n  ') + '\n';
    }

    // GROUP BY clause
    if (groupByColumns.length > 0) {
      query += 'GROUP BY\n';
      query += '  ' + groupByColumns.join(',\n  ') + '\n';
    }

    // ORDER BY clause
    if (orderByColumns.length > 0) {
      query += 'ORDER BY\n';
      const orderClauses = orderByColumns.map(order => `  ${order.column} ${order.direction}`);
      query += orderClauses.join(',\n') + '\n';
    }

    // LIMIT clause
    if (limit && limit > 0) {
      query += `LIMIT ${limit}\n`;
    }

    // Remove trailing newline
    query = query.trim();

    // Add semicolon
    query += ';';

    setGeneratedQuery(query);
  };

  useEffect(() => {
    generateSQL();
  }, [selectedTables, selectedColumns, joins, whereConditions, groupByColumns, orderByColumns, limit]);

  const operators = ['=', '!=', '<', '>', '<=', '>=', 'LIKE', 'IN', 'IS NULL', 'IS NOT NULL'];
  const joinTypes = ['INNER', 'LEFT', 'RIGHT', 'FULL OUTER'];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400">
          <Brackets size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Database Query Builder</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Build SQL queries visually with drag-and-drop interface</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {/* Left Panel - Tables and Columns */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Database size={20} />
              Database Schema
            </h2>
            <select
              value={databaseType}
              onChange={(e) => setDatabaseType(e.target.value)}
              className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm"
            >
              <option value="mysql">MySQL</option>
              <option value="postgresql">PostgreSQL</option>
              <option value="sqlite">SQLite</option>
              <option value="sqlserver">SQL Server</option>
            </select>
          </div>

          {/* Available Tables */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300">Available Tables</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {tables.map(table => (
                <div key={table.id} className="border border-slate-300 dark:border-slate-600 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Table size={16} />
                      {table.name}
                    </span>
                    <button
                      onClick={() => selectedTables.includes(table.id) ? removeTable(table.id) : addTable(table.id)}
                      className={`px-2 py-1 rounded text-xs ${
                        selectedTables.includes(table.id)
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {selectedTables.includes(table.id) ? 'Remove' : 'Add'}
                    </button>
                  </div>

                  {/* Columns */}
                  <div className="space-y-1">
                    {table.columns.map(column => (
                      <div key={column.id} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Columns size={12} />
                          <span className="font-mono text-slate-600 dark:text-slate-400">{column.name}</span>
                          <span className="text-xs text-slate-500">({column.type})</span>
                        </span>
                        {selectedTables.includes(table.id) && (
                          <button
                            onClick={() => selectedColumns.some(col => col.tableId === table.id && col.columnId === column.id)
                              ? removeColumn(table.id, column.id)
                              : addColumn(table.id, column.id)
                            }
                            className={`px-2 py-1 rounded text-xs ${
                              selectedColumns.some(col => col.tableId === table.id && col.columnId === column.id)
                                ? 'bg-red-500 text-white'
                                : 'bg-blue-500 text-white'
                            }`}
                          >
                            {selectedColumns.some(col => col.tableId === table.id && col.columnId === column.id) ? '−' : '+'}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Panel - Query Builder */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Query Builder</h2>

          {/* Selected Tables */}
          {selectedTables.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300">Selected Tables</h3>
              <div className="flex flex-wrap gap-2">
                {selectedTables.map(tableId => {
                  const table = tables.find(t => t.id === tableId);
                  return table ? (
                    <span key={tableId} className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      <Table size={14} />
                      {table.name}
                      <button
                        onClick={() => removeTable(tableId)}
                        className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                      >
                        <Minus size={12} />
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Selected Columns */}
          {selectedColumns.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300">Selected Columns</h3>
              <div className="space-y-2">
                {selectedColumns.map((col, index) => {
                  const table = tables.find(t => t.id === col.tableId);
                  const column = table?.columns.find(c => c.id === col.columnId);
                  return table && column ? (
                    <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded">
                      <span className="font-mono text-sm">{table.name}.{column.name}</span>
                      <input
                        type="text"
                        placeholder="alias"
                        value={col.alias || ''}
                        onChange={(e) => {
                          const updated = [...selectedColumns];
                          updated[index].alias = e.target.value;
                          setSelectedColumns(updated);
                        }}
                        className="px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700"
                      />
                      <button
                        onClick={() => removeColumn(col.tableId, col.columnId)}
                        className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded p-1"
                      >
                        <Minus size={14} />
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Joins */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300">Joins</h3>
              <button
                onClick={addJoin}
                className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors"
              >
                Add Join
              </button>
            </div>

            {joins.map(join => (
              <div key={join.id} className="p-3 border border-slate-300 dark:border-slate-600 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <select
                    value={join.type}
                    onChange={(e) => {
                      const updated = joins.map(j => j.id === join.id ? { ...j, type: e.target.value as Join['type'] } : j);
                      setJoins(updated);
                    }}
                    className="px-2 py-1 border border-slate-300 dark:border-slate-600 rounded text-sm"
                  >
                    {joinTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>

                  <select
                    value={join.leftTable}
                    onChange={(e) => {
                      const updated = joins.map(j => j.id === join.id ? { ...j, leftTable: e.target.value } : j);
                      setJoins(updated);
                    }}
                    className="px-2 py-1 border border-slate-300 dark:border-slate-600 rounded text-sm"
                  >
                    {selectedTables.map(tableId => {
                      const table = tables.find(t => t.id === tableId);
                      return table ? <option key={tableId} value={tableId}>{table.name}</option> : null;
                    })}
                  </select>

                  <span className="text-slate-600 dark:text-slate-400">=</span>

                  <select
                    value={join.rightTable}
                    onChange={(e) => {
                      const updated = joins.map(j => j.id === join.id ? { ...j, rightTable: e.target.value } : j);
                      setJoins(updated);
                    }}
                    className="px-2 py-1 border border-slate-300 dark:border-slate-600 rounded text-sm"
                  >
                    {selectedTables.map(tableId => {
                      const table = tables.find(t => t.id === tableId);
                      return table ? <option key={tableId} value={tableId}>{table.name}</option> : null;
                    })}
                  </select>

                  <button
                    onClick={() => removeJoin(join.id)}
                    className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded p-1"
                  >
                    <Minus size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* WHERE Conditions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300">WHERE Conditions</h3>
              <button
                onClick={addWhereCondition}
                className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 transition-colors"
              >
                Add Condition
              </button>
            </div>

            {whereConditions.map(condition => (
              <div key={condition.id} className="flex items-center gap-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                <select
                  value={condition.logic}
                  onChange={(e) => {
                    const updated = whereConditions.map(c => c.id === condition.id ? { ...c, logic: e.target.value as WhereCondition['logic'] } : c);
                    setWhereConditions(updated);
                  }}
                  className="px-2 py-1 border border-slate-300 dark:border-slate-600 rounded text-sm"
                >
                  <option value="AND">AND</option>
                  <option value="OR">OR</option>
                </select>

                <input
                  type="text"
                  placeholder="column"
                  value={condition.column}
                  onChange={(e) => {
                    const updated = whereConditions.map(c => c.id === condition.id ? { ...c, column: e.target.value } : c);
                    setWhereConditions(updated);
                  }}
                  className="px-2 py-1 border border-slate-300 dark:border-slate-600 rounded text-sm flex-1"
                />

                <select
                  value={condition.operator}
                  onChange={(e) => {
                    const updated = whereConditions.map(c => c.id === condition.id ? { ...c, operator: e.target.value } : c);
                    setWhereConditions(updated);
                  }}
                  className="px-2 py-1 border border-slate-300 dark:border-slate-600 rounded text-sm"
                >
                  {operators.map(op => (
                    <option key={op} value={op}>{op}</option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="value"
                  value={condition.value}
                  onChange={(e) => {
                    const updated = whereConditions.map(c => c.id === condition.id ? { ...c, value: e.target.value } : c);
                    setWhereConditions(updated);
                  }}
                  className="px-2 py-1 border border-slate-300 dark:border-slate-600 rounded text-sm flex-1"
                />

                <button
                  onClick={() => removeWhereCondition(condition.id)}
                  className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded p-1"
                >
                  <Minus size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* ORDER BY */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300">ORDER BY</h3>
              <button
                onClick={addOrderBy}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
              >
                Add Sort
              </button>
            </div>

            {orderByColumns.map((order, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="column"
                  value={order.column}
                  onChange={(e) => {
                    const updated = [...orderByColumns];
                    updated[index].column = e.target.value;
                    setOrderByColumns(updated);
                  }}
                  className="px-2 py-1 border border-slate-300 dark:border-slate-600 rounded text-sm flex-1"
                />

                <select
                  value={order.direction}
                  onChange={(e) => {
                    const updated = [...orderByColumns];
                    updated[index].direction = e.target.value as 'ASC' | 'DESC';
                    setOrderByColumns(updated);
                  }}
                  className="px-2 py-1 border border-slate-300 dark:border-slate-600 rounded text-sm"
                >
                  <option value="ASC">ASC</option>
                  <option value="DESC">DESC</option>
                </select>

                <button
                  onClick={() => removeOrderBy(index)}
                  className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded p-1"
                >
                  <Minus size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* LIMIT */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">LIMIT (optional)</label>
            <input
              type="number"
              value={limit || ''}
              onChange={(e) => setLimit(e.target.value ? Number(e.target.value) : null)}
              placeholder="Enter limit"
              min="1"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Panel - Generated Query */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Generated SQL</h2>
            <div className="flex gap-2">
              <button
                onClick={() => navigator.clipboard.writeText(generatedQuery)}
                disabled={!generatedQuery}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
              >
                <Copy size={14} />
                Copy
              </button>
              <button
                onClick={() => {
                  setSelectedTables([]);
                  setSelectedColumns([]);
                  setJoins([]);
                  setWhereConditions([]);
                  setGroupByColumns([]);
                  setOrderByColumns([]);
                  setLimit(null);
                  setGeneratedQuery('');
                }}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                <RotateCcw size={14} />
                Reset
              </button>
            </div>
          </div>

          <div className="h-96 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <div className="p-4 h-full overflow-y-auto">
              <pre className="whitespace-pre-wrap text-slate-900 dark:text-slate-100 font-mono text-sm leading-relaxed">
                {generatedQuery || 'Select tables and columns to generate SQL query...'}
              </pre>
            </div>
          </div>

          {/* Query Statistics */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
            <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-3">Query Statistics</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-slate-600 dark:text-slate-400">Tables Selected</div>
                <div className="font-medium text-blue-600">{selectedTables.length}</div>
              </div>
              <div>
                <div className="text-slate-600 dark:text-slate-400">Columns Selected</div>
                <div className="font-medium text-green-600">{selectedColumns.length}</div>
              </div>
              <div>
                <div className="text-slate-600 dark:text-slate-400">Joins</div>
                <div className="font-medium text-purple-600">{joins.length}</div>
              </div>
              <div>
                <div className="text-slate-600 dark:text-slate-400">Conditions</div>
                <div className="font-medium text-orange-600">{whereConditions.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Info */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
        <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">🗄️ Database Query Builder Features</h4>
        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
          <li>• <strong>Visual Query Building</strong> - Drag-and-drop interface for SQL construction</li>
          <li>• <strong>Multi-Table Support</strong> - Join tables with different join types</li>
          <li>• <strong>Advanced Filtering</strong> - WHERE conditions with multiple operators</li>
          <li>• <strong>Flexible Sorting</strong> - ORDER BY with ASC/DESC options</li>
          <li>• <strong>Real-time SQL Generation</strong> - Instant query preview and updates</li>
        </ul>
      </div>
    </div>
  );
};

export default DatabaseQueryBuilder;
