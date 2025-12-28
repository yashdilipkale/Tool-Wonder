import React, { useState } from 'react';
import { Send, Play, Copy, RotateCcw, Settings, Globe, Key, Clock } from 'lucide-react';

interface HttpMethod {
  value: string;
  label: string;
  color: string;
}

const ApiTester: React.FC = () => {
  const [url, setUrl] = useState<string>('https://jsonplaceholder.typicode.com/posts/1');
  const [method, setMethod] = useState<string>('GET');
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([
    { key: 'Content-Type', value: 'application/json' }
  ]);
  const [body, setBody] = useState<string>('{\n  "title": "Test",\n  "body": "Test body",\n  "userId": 1\n}');
  const [authType, setAuthType] = useState<string>('none');
  const [authToken, setAuthToken] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [status, setStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [responseTime, setResponseTime] = useState<number>(0);

  const httpMethods: HttpMethod[] = [
    { value: 'GET', label: 'GET', color: 'bg-green-600' },
    { value: 'POST', label: 'POST', color: 'bg-blue-600' },
    { value: 'PUT', label: 'PUT', color: 'bg-yellow-600' },
    { value: 'DELETE', label: 'DELETE', color: 'bg-red-600' },
    { value: 'PATCH', label: 'PATCH', color: 'bg-purple-600' },
    { value: 'HEAD', label: 'HEAD', color: 'bg-gray-600' },
    { value: 'OPTIONS', label: 'OPTIONS', color: 'bg-indigo-600' }
  ];

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...headers];
    updated[index][field] = value;
    setHeaders(updated);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const makeRequest = async () => {
    if (!url.trim()) return;

    setLoading(true);
    const startTime = performance.now();

    try {
      // Build headers object
      const headersObj: { [key: string]: string } = {};
      headers.forEach(header => {
        if (header.key.trim()) {
          headersObj[header.key] = header.value;
        }
      });

      // Add auth header if needed
      if (authType === 'bearer' && authToken) {
        headersObj['Authorization'] = `Bearer ${authToken}`;
      } else if (authType === 'basic' && authToken) {
        headersObj['Authorization'] = `Basic ${btoa(authToken)}`;
      }

      // Prepare request options
      const requestOptions: RequestInit = {
        method,
        headers: headersObj
      };

      // Add body for methods that support it
      if (['POST', 'PUT', 'PATCH'].includes(method) && body.trim()) {
        requestOptions.body = body;
      }

      const response = await fetch(url, requestOptions);
      const endTime = performance.now();

      setStatus(response.status);
      setResponseTime(Math.round(endTime - startTime));

      // Get response text
      const responseText = await response.text();
      setResponse(responseText);

    } catch (error) {
      setStatus(null);
      setResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setResponseTime(Math.round(performance.now() - startTime));
    }

    setLoading(false);
  };

  const handleCopyResponse = async () => {
    if (response) {
      await navigator.clipboard.writeText(response);
    }
  };

  const handleReset = () => {
    setUrl('https://jsonplaceholder.typicode.com/posts/1');
    setMethod('GET');
    setHeaders([{ key: 'Content-Type', value: 'application/json' }]);
    setBody('{\n  "title": "Test",\n  "body": "Test body",\n  "userId": 1\n}');
    setAuthType('none');
    setAuthToken('');
    setResponse('');
    setStatus(null);
    setResponseTime(0);
  };

  const getStatusColor = (status: number | null) => {
    if (!status) return 'text-gray-600';
    if (status >= 200 && status < 300) return 'text-green-600';
    if (status >= 300 && status < 400) return 'text-blue-600';
    if (status >= 400 && status < 500) return 'text-yellow-600';
    return 'text-red-600';
  };

  const commonEndpoints = [
    { name: 'JSON Placeholder', url: 'https://jsonplaceholder.typicode.com/posts/1', method: 'GET' },
    { name: 'GitHub API', url: 'https://api.github.com/user', method: 'GET' },
    { name: 'Random User', url: 'https://randomuser.me/api/', method: 'GET' },
    { name: 'Cat Facts', url: 'https://catfact.ninja/fact', method: 'GET' },
    { name: 'HTTP Status', url: 'https://httpstat.us/200', method: 'GET' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
          <Send size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">API Tester</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Test REST APIs with authentication and custom parameters</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Request</h2>

          {/* URL and Method */}
          <div className="space-y-3">
            <div className="flex gap-3">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-medium"
              >
                {httpMethods.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>

              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.example.com/endpoint"
                className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <button
                onClick={makeRequest}
                disabled={!url.trim() || loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                ) : (
                  <Play size={16} />
                )}
                Send
              </button>
            </div>
          </div>

          {/* Common Endpoints */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Quick Endpoints:
            </label>
            <div className="flex flex-wrap gap-2">
              {commonEndpoints.map((endpoint, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setUrl(endpoint.url);
                    setMethod(endpoint.method);
                  }}
                  className="px-3 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  {endpoint.name}
                </button>
              ))}
            </div>
          </div>

          {/* Authentication */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Key size={20} />
              Authentication
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <select
                value={authType}
                onChange={(e) => setAuthType(e.target.value)}
                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              >
                <option value="none">No Auth</option>
                <option value="bearer">Bearer Token</option>
                <option value="basic">Basic Auth</option>
              </select>

              {authType !== 'none' && (
                <input
                  type="password"
                  value={authToken}
                  onChange={(e) => setAuthToken(e.target.value)}
                  placeholder={authType === 'bearer' ? 'Enter token...' : 'username:password'}
                  className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
            </div>
          </div>

          {/* Headers */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Headers</h3>
              <button
                onClick={addHeader}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
              >
                Add Header
              </button>
            </div>

            <div className="space-y-2">
              {headers.map((header, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={header.key}
                    onChange={(e) => updateHeader(index, 'key', e.target.value)}
                    placeholder="Header name"
                    className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={header.value}
                    onChange={(e) => updateHeader(index, 'value', e.target.value)}
                    placeholder="Header value"
                    className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => removeHeader(index)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Request Body */}
          {['POST', 'PUT', 'PATCH'].includes(method) && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Request Body</h3>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Enter request body (JSON, XML, etc.)"
                className="w-full h-32 p-3 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-none"
              />
            </div>
          )}

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw size={16} className="inline mr-2" />
            Reset Request
          </button>
        </div>

        {/* Response Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Response</h2>
            {response && (
              <button
                onClick={handleCopyResponse}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                <Copy size={14} />
                Copy
              </button>
            )}
          </div>

          {/* Status and Timing */}
          {(status !== null || responseTime > 0) && (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-slate-600 dark:text-slate-400">Status</div>
                  <div className={`font-medium ${getStatusColor(status)}`}>
                    {status ? `${status} ${getStatusText(status)}` : 'Error'}
                  </div>
                </div>
                <div>
                  <div className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <Clock size={14} />
                    Response Time
                  </div>
                  <div className="font-medium">{responseTime}ms</div>
                </div>
              </div>
            </div>
          )}

          {/* Response Body */}
          <div className="h-64 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            {response ? (
              <div className="p-4 h-full overflow-y-auto">
                <pre className="whitespace-pre-wrap text-slate-900 dark:text-slate-100 font-mono text-sm leading-relaxed">
                  {response}
                </pre>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
                <div className="text-center">
                  <Globe size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Response will appear here</p>
                  <p className="text-sm mt-2">Send a request to see the response</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Info */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
        <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">🚀 API Testing Features</h4>
        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
          <li>• <strong>HTTP Methods</strong> - GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS</li>
          <li>• <strong>Authentication</strong> - Bearer tokens and Basic auth support</li>
          <li>• <strong>Custom Headers</strong> - Add any HTTP headers to your requests</li>
          <li>• <strong>Request Body</strong> - JSON, XML, or custom body content</li>
          <li>• <strong>Response Analysis</strong> - Status codes and response time tracking</li>
        </ul>
      </div>
    </div>
  );
};

const getStatusText = (status: number): string => {
  const statusTexts: { [key: number]: string } = {
    200: 'OK',
    201: 'Created',
    204: 'No Content',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    422: 'Unprocessable Entity',
    500: 'Internal Server Error'
  };
  return statusTexts[status] || 'Unknown';
};

export default ApiTester;
