import React from 'react';
import { FileText, AlertTriangle, Shield, Users, Scale, Mail } from 'lucide-react';

const TermsOfUse: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Terms of Use</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Last updated: December 25, 2025</p>
        </div>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Agreement to Terms</h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              These Terms of Use ("Terms") govern your use of our Tools Collection website and all associated tools, services, and content (collectively, the "Service"). By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Description of Service
            </h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              Our Service provides a collection of online tools for various purposes including but not limited to:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded">
                <span className="text-sm text-slate-700 dark:text-slate-300">Text processing tools</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded">
                <span className="text-sm text-slate-700 dark:text-slate-300">Image manipulation tools</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded">
                <span className="text-sm text-slate-700 dark:text-slate-300">Development utilities</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded">
                <span className="text-sm text-slate-700 dark:text-slate-300">Calculators and converters</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded">
                <span className="text-sm text-slate-700 dark:text-slate-300">SEO and analysis tools</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded">
                <span className="text-sm text-slate-700 dark:text-slate-300">Generators and encoders</span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Acceptable Use Policy
            </h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              You agree to use our Service only for lawful purposes and in accordance with these Terms. You agree not to use our Service:
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                <h4 className="font-semibold text-red-800 dark:text-red-200 mb-1">Prohibited Activities</h4>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                  <li>• Violate any applicable laws or regulations</li>
                  <li>• Generate harmful, offensive, or illegal content</li>
                  <li>• Attempt to gain unauthorized access to our systems</li>
                  <li>• Use automated tools to access our Service excessively</li>
                  <li>• Upload malicious files or malware</li>
                  <li>• Distribute copyrighted material without permission</li>
                </ul>
              </div>

              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">Content Guidelines</h4>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  <li>• Respect intellectual property rights</li>
                  <li>• Do not upload sensitive personal information</li>
                  <li>• Avoid processing illegal or harmful content</li>
                  <li>• Use tools responsibly and ethically</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">User Responsibilities</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Account Security</h3>
                <p className="text-slate-700 dark:text-slate-300">
                  If you create an account, you are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Data Backup</h3>
                <p className="text-slate-700 dark:text-slate-300">
                  You are responsible for maintaining appropriate backups of your data. We are not responsible for any loss of data resulting from your use of our Service.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Content Ownership</h3>
                <p className="text-slate-700 dark:text-slate-300">
                  You retain ownership of the content you input into our tools. However, by using our Service, you grant us a limited license to process and temporarily store your content for the purpose of providing the Service.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Scale className="w-5 h-5" />
              Disclaimers and Limitations
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Service Availability</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  Our Service is provided "as is" and "as available" without warranties of any kind. We do not guarantee that our Service will be uninterrupted, error-free, or available at all times.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Accuracy of Results</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  While we strive to provide accurate tools, we cannot guarantee the accuracy, completeness, or reliability of any results generated by our tools. You should verify critical results through other means.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Third-Party Services</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  Our Service may contain links to third-party websites or services that are not owned or controlled by us. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites or services.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Limitation of Liability</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              In no event shall we, our directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-1 ml-4">
              <li>Your use or inability to use our Service</li>
              <li>Any unauthorized access to or use of our servers</li>
              <li>Any interruption or cessation of transmission to or from our Service</li>
              <li>Any bugs, viruses, trojan horses, or the like that may be transmitted to or through our Service</li>
              <li>Any errors or omissions in any content or for any loss or damage incurred as a result of your use</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Intellectual Property</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              The Service and its original content, features, and functionality are and will remain the exclusive property of us and our licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Your Content</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">You retain rights to content you input</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Our Platform</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">We own the tools and platform code</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Termination</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              We may terminate or suspend your access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms.
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              Upon termination, your right to use the Service will cease immediately. All provisions of these Terms which by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Governing Law
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              These Terms shall be interpreted and governed by the laws of [Jurisdiction], without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Changes to Terms</h2>
            <p className="text-slate-700 dark:text-slate-300">
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contact Information
            </h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              If you have any questions about these Terms of Use, please contact us:
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Mail className="w-4 h-4" />
                <span>Email: legal@toolscollection.com</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <span>By using our Service, you acknowledge that you have read and understood these Terms of Use and agree to be bound by them.</span>
              </div>
            </div>
          </section>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
              These Terms of Use are effective as of December 25, 2025. Continued use of our Service after any changes constitutes acceptance of the new terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;
