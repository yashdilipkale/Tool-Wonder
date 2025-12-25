import React from 'react';
import { Shield, Eye, Lock, Database, Cookie, Mail, Phone, MapPin } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Privacy Policy</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Last updated: December 25, 2025</p>
        </div>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Introduction</h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Welcome to our Tools Collection website ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our tools.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Information We Collect
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Information You Provide</h3>
                <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-1 ml-4">
                  <li>Data entered into our tools for processing (text, images, etc.)</li>
                  <li>Contact information when you reach out to us</li>
                  <li>Feedback and support requests</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Automatically Collected Information</h3>
                <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-1 ml-4">
                  <li>IP address and location information</li>
                  <li>Browser type and version</li>
                  <li>Device information</li>
                  <li>Usage patterns and tool interactions</li>
                  <li>Cookies and similar technologies</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Database className="w-5 h-5" />
              How We Use Your Information
            </h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              We use the information we collect for the following purposes:
            </p>
            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2 ml-4">
              <li><strong>Tool Functionality:</strong> To process and provide the tools and services you request</li>
              <li><strong>Website Improvement:</strong> To analyze usage patterns and improve our tools</li>
              <li><strong>Security:</strong> To detect and prevent fraud, abuse, and security threats</li>
              <li><strong>Communication:</strong> To respond to your inquiries and provide support</li>
              <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Data Security
            </h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              We implement appropriate technical and organizational measures to protect your personal information:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Technical Measures</h4>
                <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                  <li>• SSL/TLS encryption</li>
                  <li>• Secure data transmission</li>
                  <li>• Regular security updates</li>
                  <li>• Access controls</li>
                </ul>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Organizational Measures</h4>
                <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                  <li>• Limited data access</li>
                  <li>• Employee training</li>
                  <li>• Regular audits</li>
                  <li>• Incident response plan</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Cookie className="w-5 h-5" />
              Cookies and Tracking
            </h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              We use cookies and similar technologies to enhance your experience:
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded">
                <h4 className="font-semibold text-slate-900 dark:text-white">Essential Cookies</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Required for website functionality and security</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded">
                <h4 className="font-semibold text-slate-900 dark:text-white">Analytics Cookies</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Help us understand how visitors use our site</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded">
                <h4 className="font-semibold text-slate-900 dark:text-white">Preference Cookies</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Remember your settings and preferences</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Data Retention</h2>
            <p className="text-slate-700 dark:text-slate-300">
              We retain your information only as long as necessary for the purposes outlined in this policy:
            </p>
            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-1 ml-4 mt-2">
              <li>Tool processing data is not stored permanently</li>
              <li>Contact information is kept for support purposes</li>
              <li>Analytics data is aggregated and anonymized</li>
              <li>Legal requirements may extend retention periods</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Your Rights</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              Depending on your location, you may have the following rights regarding your personal information:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-slate-700 dark:text-slate-300">Access your personal information</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-slate-700 dark:text-slate-300">Correct inaccurate information</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-slate-700 dark:text-slate-300">Delete your personal information</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-slate-700 dark:text-slate-300">Object to processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-slate-700 dark:text-slate-300">Data portability</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-slate-700 dark:text-slate-300">Withdraw consent</span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contact Us
            </h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Mail className="w-4 h-4" />
                <span>Email: privacy@toolscollection.com</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <MapPin className="w-4 h-4" />
                <span>Address: [Company Address]</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Phone className="w-4 h-4" />
                <span>Phone: [Contact Number]</span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Changes to This Policy</h2>
            <p className="text-slate-700 dark:text-slate-300">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
            </p>
          </section>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
              This privacy policy is effective as of December 25, 2025. By using our website, you agree to the collection and use of information in accordance with this policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
