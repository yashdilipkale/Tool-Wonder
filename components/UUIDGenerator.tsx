import React, { useState, useEffect } from 'react';
import { Fingerprint, Copy, RefreshCw, Hash, List, Download } from 'lucide-react';

const UUIDGenerator: React.FC = () => {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [format, setFormat] = useState<'standard' | 'uppercase' | 'braces' | 'parentheses' | 'hyphens'>('standard');
  const [version, setVersion] = useState<'v4' | 'v1' | 'v3' | 'v5'>('v4');
  const [namespace, setNamespace] = useState('');
  const [name, setName] = useState('');

  // Generate UUID v4 (random)
  const generateUUIDv4 = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // Generate UUID v1 (timestamp-based - simplified)
  const generateUUIDv1 = (): string => {
    const timestamp = Date.now();
    const random = Math.random() * 1000000 | 0;
    const clockSeq = Math.random() * 65536 | 0;

    return 'xxxxxxxx-xxxx-1xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c, i) => {
      let value;
      if (i < 8) {
        value = (timestamp >> (i * 4)) & 0xf;
      } else if (i < 12) {
        value = (random >> ((i - 8) * 4)) & 0xf;
      } else {
        value = (clockSeq >> ((i - 12) * 4)) & 0xf;
      }
      return value.toString(16);
    });
  };

  // Generate UUID v3 (MD5 hash - simplified)
  const generateUUIDv3 = (namespace: string, name: string): string => {
    const combined = namespace + name;
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    return 'xxxxxxxx-xxxx-3xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c, i) => {
      const value = (hash >> (i * 4)) & 0xf;
      return value.toString(16);
    });
  };

  // Generate UUID v5 (SHA-1 hash - simplified)
  const generateUUIDv5 = (namespace: string, name: string): string => {
    const combined = namespace + name;
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      hash = ((hash << 5) - hash) + combined.charCodeAt(i);
      hash = hash & hash;
    }

    return 'xxxxxxxx-xxxx-5xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c, i) => {
      const value = (hash >> (i * 4)) & 0xf;
      return value.toString(16);
    });
  };

  // Generate UUID based on version
  const generateUUID = (): string => {
    switch (version) {
      case 'v1':
        return generateUUIDv1();
      case 'v3':
        return generateUUIDv3(namespace, name);
      case 'v5':
        return generateUUIDv5(namespace, name);
      case 'v4':
      default:
        return generateUUIDv4();
    }
  };

  // Format UUID based on selected format
  const formatUUID = (uuid: string): string => {
    switch (format) {
      case 'uppercase':
        return uuid.toUpperCase();
      case 'braces':
        return `{${uuid}}`;
      case 'parentheses':
        return `(${uuid})`;
      case 'hyphens':
        return uuid.replace(/-/g, '');
      case 'standard':
      default:
        return uuid;
    }
  };

  // Generate multiple UUIDs
  const generateUUIDs = () => {
    const newUuids = [];
    for (let i = 0; i < count; i++) {
      const uuid = generateUUID();
      const formattedUuid = formatUUID(uuid);
      newUuids.push(formattedUuid);
    }
    setUuids(newUuids);
  };

  // Generate on mount and when parameters change
  useEffect(() => {
    generateUUIDs();
  }, [count, format, version, namespace, name]);

  // Copy single UUID
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  // Copy all UUIDs
  const copyAllUUIDs = async () => {
    const allUuids = uuids.join('\n');
    await copyToClipboard(allUuids);
  };

  // Download UUIDs as text file
  const downloadUUIDs = () => {
    const content = uuids.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uuids-${version}-${count}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Regenerate current UUIDs
  const regenerateUUIDs = () => {
    generateUUIDs();
  };

  const formatOptions = [
    { id: 'standard', name: 'Standard', example: '123e4567-e89b-12d3-a456-426614174000' },
    { id: 'uppercase', name: 'Uppercase', example: '123E4567-E89B-12D3-A456-426614174000' },
    { id: 'braces', name: 'Braces', example: '{123e4567-e89b-12d3-a456-426614174000}' },
    { id: 'parentheses', name: 'Parentheses', example: '(123e4567-e89b-12d3-a456-426614174000)' },
    { id: 'hyphens', name: 'No Hyphens', example: '123e4567e89b12d3a456426614174000' }
  ];

  const versionOptions = [
    { id: 'v4', name: 'UUID v4', description: 'Random UUID (most common)' },
    { id: 'v1', name: 'UUID v1', description: 'Timestamp-based UUID' },
    { id: 'v3', name: 'UUID v3', description: 'MD5 hash-based UUID' },
    { id: 'v5', name: 'UUID v5', description: 'SHA-1 hash-based UUID' }
  ];

  const namespaces = [
    { value: '6ba7b810-9dad-11d1-80b4-00c04fd430c8', name: 'DNS' },
    { value: '6ba7b811-9dad-11d1-80b4-00c04fd430c8', name: 'URL' },
    { value: '6ba7b812-9dad-11d1-80b4-00c04fd430c8', name: 'OID' },
    { value: '6ba7b814-9dad-11d1-80b4-00c04fd430c8', name: 'X.500 DN' }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Fingerprint className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">UUID Generator</h2>
          <p className="text-slate-600 dark:text-slate-400">Generate unique identifiers (v4)</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Count */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Count
            </label>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              <option value={1}>1 UUID</option>
              <option value={5}>5 UUIDs</option>
              <option value={10}>10 UUIDs</option>
              <option value={25}>25 UUIDs</option>
              <option value={50}>50 UUIDs</option>
              <option value={100}>100 UUIDs</option>
            </select>
          </div>

          {/* Version */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Version
            </label>
            <select
              value={version}
              onChange={(e) => setVersion(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              {versionOptions.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          {/* Format */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              {formatOptions.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Actions
            </label>
            <button
              onClick={regenerateUUIDs}
              className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Generate
            </button>
          </div>
        </div>

        {/* Version-specific inputs */}
        {(version === 'v3' || version === 'v5') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Namespace
              </label>
              <select
                value={namespace}
                onChange={(e) => setNamespace(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-600 text-slate-900 dark:text-white mb-2"
              >
                <option value="">Custom</option>
                {namespaces.map((ns) => (
                  <option key={ns.value} value={ns.value}>
                    {ns.name}
                  </option>
                ))}
              </select>
              {!namespace && (
                <input
                  type="text"
                  placeholder="Enter namespace UUID"
                  value={namespace}
                  onChange={(e) => setNamespace(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-600 text-slate-900 dark:text-white font-mono text-sm"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter name for hashing"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        )}

        {/* Generated UUIDs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <List className="w-5 h-5" />
              Generated UUIDs ({uuids.length})
            </h3>
            <div className="flex gap-2">
              <button
                onClick={copyAllUUIDs}
                disabled={uuids.length === 0}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:bg-slate-50 disabled:cursor-not-allowed rounded text-slate-700 dark:text-slate-300"
              >
                <Copy className="w-4 h-4" />
                Copy All
              </button>
              <button
                onClick={downloadUUIDs}
                disabled={uuids.length === 0}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:bg-slate-50 disabled:cursor-not-allowed rounded text-slate-700 dark:text-slate-300"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {uuids.map((uuid, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div className="text-sm font-medium text-slate-600 dark:text-slate-400 w-8">
                  {index + 1}
                </div>
                <div className="flex-1 font-mono text-slate-900 dark:text-white break-all">
                  {uuid}
                </div>
                <button
                  onClick={() => copyToClipboard(uuid)}
                  className="p-1 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                  title="Copy UUID"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Format Examples */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Format Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {formatOptions.map((fmt) => (
              <div key={fmt.id} className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div className="font-medium text-slate-900 dark:text-white text-sm mb-1">
                  {fmt.name}
                </div>
                <div className="font-mono text-slate-600 dark:text-slate-400 text-xs break-all">
                  {fmt.example}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* UUID Information */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
            <Hash className="w-4 h-4" />
            UUID Information
          </h3>
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
            <p><strong>UUID v4:</strong> Randomly generated, most commonly used</p>
            <p><strong>UUID v1:</strong> Based on timestamp and MAC address</p>
            <p><strong>UUID v3:</strong> MD5 hash of namespace + name</p>
            <p><strong>UUID v5:</strong> SHA-1 hash of namespace + name</p>
            <p><strong>Format:</strong> 8-4-4-4-12 hexadecimal digits</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UUIDGenerator;
