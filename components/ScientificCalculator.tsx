import React, { useState } from 'react';
import { Calculator, RotateCcw, Delete } from 'lucide-react';

const ScientificCalculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memory, setMemory] = useState<number>(0);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const clearEntry = () => {
    setDisplay('0');
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '^':
        return Math.pow(firstValue, secondValue);
      case 'mod':
        return firstValue % secondValue;
      default:
        return secondValue;
    }
  };

  const performFunction = (func: string) => {
    const inputValue = parseFloat(display);
    let result: number;

    switch (func) {
      case 'sin':
        result = Math.sin(inputValue * Math.PI / 180);
        break;
      case 'cos':
        result = Math.cos(inputValue * Math.PI / 180);
        break;
      case 'tan':
        result = Math.tan(inputValue * Math.PI / 180);
        break;
      case 'asin':
        result = Math.asin(inputValue) * 180 / Math.PI;
        break;
      case 'acos':
        result = Math.acos(inputValue) * 180 / Math.PI;
        break;
      case 'atan':
        result = Math.atan(inputValue) * 180 / Math.PI;
        break;
      case 'log':
        result = Math.log10(inputValue);
        break;
      case 'ln':
        result = Math.log(inputValue);
        break;
      case 'sqrt':
        result = Math.sqrt(inputValue);
        break;
      case 'square':
        result = inputValue * inputValue;
        break;
      case 'cube':
        result = inputValue * inputValue * inputValue;
        break;
      case '1/x':
        result = 1 / inputValue;
        break;
      case 'factorial':
        result = factorial(inputValue);
        break;
      case 'pi':
        result = Math.PI;
        break;
      case 'e':
        result = Math.E;
        break;
      default:
        return;
    }

    setDisplay(String(result));
    setWaitingForOperand(true);
  };

  const factorial = (n: number): number => {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const memoryOperation = (op: string) => {
    const currentValue = parseFloat(display);

    switch (op) {
      case 'MC':
        setMemory(0);
        break;
      case 'MR':
        setDisplay(String(memory));
        setWaitingForOperand(true);
        break;
      case 'MS':
        setMemory(currentValue);
        break;
      case 'M+':
        setMemory(memory + currentValue);
        break;
      case 'M-':
        setMemory(memory - currentValue);
        break;
    }
  };

  const equals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const toggleSign = () => {
    const currentValue = parseFloat(display);
    setDisplay(String(-currentValue));
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
            <Calculator size={20} />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Scientific Calculator</h2>
        </div>

        {/* Display */}
        <div className="mb-6">
          <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 mb-2">
            <div className="text-right text-2xl font-mono font-bold text-slate-900 dark:text-white min-h-[2rem] break-all">
              {display}
            </div>
          </div>
          {operation && previousValue !== null && (
            <div className="text-right text-sm text-slate-500 dark:text-slate-400">
              {previousValue} {operation}
            </div>
          )}
          <div className="text-right text-sm text-slate-500 dark:text-slate-400">
            Memory: {memory}
          </div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-5 gap-2">
          {/* Memory functions */}
          <button
            onClick={() => memoryOperation('MC')}
            className="col-span-1 p-3 text-xs bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors"
          >
            MC
          </button>
          <button
            onClick={() => memoryOperation('MR')}
            className="col-span-1 p-3 text-xs bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors"
          >
            MR
          </button>
          <button
            onClick={() => memoryOperation('MS')}
            className="col-span-1 p-3 text-xs bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors"
          >
            MS
          </button>
          <button
            onClick={() => memoryOperation('M+')}
            className="col-span-1 p-3 text-xs bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors"
          >
            M+
          </button>
          <button
            onClick={() => memoryOperation('M-')}
            className="col-span-1 p-3 text-xs bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors"
          >
            M-
          </button>

          {/* Scientific functions row 1 */}
          <button
            onClick={() => performFunction('sin')}
            className="col-span-1 p-2 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
          >
            sin
          </button>
          <button
            onClick={() => performFunction('cos')}
            className="col-span-1 p-2 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
          >
            cos
          </button>
          <button
            onClick={() => performFunction('tan')}
            className="col-span-1 p-2 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
          >
            tan
          </button>
          <button
            onClick={() => performFunction('log')}
            className="col-span-1 p-2 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
          >
            log
          </button>
          <button
            onClick={() => performFunction('ln')}
            className="col-span-1 p-2 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
          >
            ln
          </button>

          {/* Scientific functions row 2 */}
          <button
            onClick={() => performFunction('sqrt')}
            className="col-span-1 p-2 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
          >
            √
          </button>
          <button
            onClick={() => performFunction('square')}
            className="col-span-1 p-2 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
          >
            x²
          </button>
          <button
            onClick={() => performFunction('cube')}
            className="col-span-1 p-2 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
          >
            x³
          </button>
          <button
            onClick={() => performFunction('1/x')}
            className="col-span-1 p-2 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
          >
            1/x
          </button>
          <button
            onClick={() => performFunction('factorial')}
            className="col-span-1 p-2 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
          >
            n!
          </button>

          {/* Constants */}
          <button
            onClick={() => performFunction('pi')}
            className="col-span-1 p-2 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
          >
            π
          </button>
          <button
            onClick={() => performFunction('e')}
            className="col-span-1 p-2 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
          >
            e
          </button>
          <button
            onClick={clearEntry}
            className="col-span-1 p-2 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
          >
            CE
          </button>
          <button
            onClick={clear}
            className="col-span-1 p-2 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
          >
            C
          </button>
          <button
            onClick={toggleSign}
            className="col-span-1 p-2 text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors"
          >
            ±
          </button>

          {/* Numbers and operations */}
          <button
            onClick={() => inputNumber('7')}
            className="col-span-1 p-3 bg-slate-100 dark:bg-slate-600 text-slate-900 dark:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors font-semibold"
          >
            7
          </button>
          <button
            onClick={() => inputNumber('8')}
            className="col-span-1 p-3 bg-slate-100 dark:bg-slate-600 text-slate-900 dark:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors font-semibold"
          >
            8
          </button>
          <button
            onClick={() => inputNumber('9')}
            className="col-span-1 p-3 bg-slate-100 dark:bg-slate-600 text-slate-900 dark:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors font-semibold"
          >
            9
          </button>
          <button
            onClick={() => performOperation('÷')}
            className="col-span-1 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            ÷
          </button>
          <button
            onClick={() => performOperation('^')}
            className="col-span-1 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            ^
          </button>

          <button
            onClick={() => inputNumber('4')}
            className="col-span-1 p-3 bg-slate-100 dark:bg-slate-600 text-slate-900 dark:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors font-semibold"
          >
            4
          </button>
          <button
            onClick={() => inputNumber('5')}
            className="col-span-1 p-3 bg-slate-100 dark:bg-slate-600 text-slate-900 dark:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors font-semibold"
          >
            5
          </button>
          <button
            onClick={() => inputNumber('6')}
            className="col-span-1 p-3 bg-slate-100 dark:bg-slate-600 text-slate-900 dark:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors font-semibold"
          >
            6
          </button>
          <button
            onClick={() => performOperation('×')}
            className="col-span-1 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            ×
          </button>
          <button
            onClick={() => performOperation('mod')}
            className="col-span-1 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-semibold"
          >
            mod
          </button>

          <button
            onClick={() => inputNumber('1')}
            className="col-span-1 p-3 bg-slate-100 dark:bg-slate-600 text-slate-900 dark:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors font-semibold"
          >
            1
          </button>
          <button
            onClick={() => inputNumber('2')}
            className="col-span-1 p-3 bg-slate-100 dark:bg-slate-600 text-slate-900 dark:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors font-semibold"
          >
            2
          </button>
          <button
            onClick={() => inputNumber('3')}
            className="col-span-1 p-3 bg-slate-100 dark:bg-slate-600 text-slate-900 dark:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors font-semibold"
          >
            3
          </button>
          <button
            onClick={() => performOperation('-')}
            className="col-span-1 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            −
          </button>
          <button
            onClick={inputDecimal}
            className="col-span-1 p-3 bg-slate-100 dark:bg-slate-600 text-slate-900 dark:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors font-semibold"
          >
            .
          </button>

          <button
            onClick={() => inputNumber('0')}
            className="col-span-2 p-3 bg-slate-100 dark:bg-slate-600 text-slate-900 dark:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors font-semibold"
          >
            0
          </button>
          <button
            onClick={() => performOperation('+')}
            className="col-span-1 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            +
          </button>
          <button
            onClick={equals}
            className="col-span-2 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            =
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">How to use:</h3>
          <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Click numbers and operations to build expressions</li>
            <li>• Use scientific functions for advanced calculations</li>
            <li>• Memory buttons (MC, MR, MS, M+, M-) store and recall values</li>
            <li>• CE clears current entry, C clears everything</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ScientificCalculator;
