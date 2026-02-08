import React, { useState } from 'react';
import { X, CreditCard, Lock, CheckCircle, AlertCircle, IndianRupee } from 'lucide-react';
import { PricingPlan } from '../types';

interface CheckoutModalProps {
  plan: PricingPlan;
  billingInterval: 'month' | 'year';
  onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ plan, billingInterval, onClose }) => {
  const [step, setStep] = useState<'payment' | 'processing' | 'success' | 'error'>('payment');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const totalPrice = billingInterval === 'year' 
    ? (plan.price * 12 * 0.5).toFixed(2) 
    : plan.price.toFixed(2);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.replace('/', '').length <= 4) {
      setExpiryDate(formatted);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/gi, '');
    if (value.length <= 4) {
      setCvv(value);
    }
  };

  const validateForm = () => {
    if (!name || !email || !cardNumber || !expiryDate || !cvv) {
      setErrorMessage('Please fill in all fields');
      return false;
    }

    if (cardNumber.replace(/\s/g, '').length !== 16) {
      setErrorMessage('Invalid card number');
      return false;
    }

    if (expiryDate.length !== 5) {
      setErrorMessage('Invalid expiry date');
      return false;
    }

    if (cvv.length < 3) {
      setErrorMessage('Invalid CVV');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Invalid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateForm()) {
      return;
    }

    setStep('processing');

    try {
      // Simulate API call to backend for Razorpay payment processing
      // In production, this would call your backend endpoint which creates a Razorpay order
      const response = await fetch('http://localhost:3002/api/create-razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: plan.id,
          interval: billingInterval,
          email,
          name,
          amount: Math.round(parseFloat(totalPrice) * 100), // Convert to paise
          currency: 'INR'
        }),
      });

      if (!response.ok) {
        throw new Error('Payment failed');
      }

      const orderData = await response.json();
      
      // Initialize Razorpay payment
      const options = {
        key: 'rzp_test_your_razorpay_key', // Replace with your Razorpay key
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'ToolsWonder',
        description: `${plan.name} Plan - ${billingInterval === 'year' ? 'Annual' : 'Monthly'}`,
        order_id: orderData.id,
        handler: function (response: any) {
          // Payment successful
          setStep('success');
        },
        prefill: {
          name: name,
          email: email,
        },
        theme: {
          color: '#6366f1'
        }
      };

      // @ts-ignore - Razorpay is loaded globally
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage('Payment failed. Please try again or contact support.');
      setStep('error');
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {step === 'success' ? 'Payment Successful!' : 'Secure Checkout'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {step === 'payment' && 'Complete your purchase securely'}
              {step === 'processing' && 'Processing your payment...'}
              {step === 'success' && 'Welcome to ' + plan.name + '!'}
              {step === 'error' && 'Payment failed'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <X size={24} className="text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'payment' && (
            <>
              {/* Plan Summary */}
              <div className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {plan.name} Plan
                  </span>
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    ${totalPrice}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Billed {billingInterval === 'year' ? 'annually' : 'monthly'}
                  {billingInterval === 'year' && ' (Save 50%)'}
                </p>
              </div>

              {/* Payment Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Card Number */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-2 pl-10 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  </div>
                </div>

                {/* Expiry and CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={expiryDate}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={cvv}
                      onChange={handleCvvChange}
                      placeholder="123"
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                    <AlertCircle size={16} />
                    {errorMessage}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <IndianRupee size={18} />
                  Pay ₹{Math.round(parseFloat(totalPrice) * 80)} {/* Convert USD to INR at 80:1 */}
                </button>

                {/* Security Notice */}
                <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                  <Lock size={12} className="inline mr-1" />
                  Secured by Razorpay. Your payment information is encrypted.
                </p>
              </form>
            </>
          )}

          {step === 'processing' && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">
                Processing your payment...
              </p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Payment Successful!
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Welcome to {plan.name}! You now have access to all premium features.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Get Started
              </button>
            </div>
          )}

          {step === 'error' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Payment Failed
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {errorMessage || 'Something went wrong. Please try again.'}
              </p>
              <button
                onClick={() => setStep('payment')}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;