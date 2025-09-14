import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-zinc-900 text-orange-500 px-6 py-12 min-h-screen">
      <div className="max-w-3xl mx-auto bg-zinc-800 rounded-lg p-8">
        <h1 className="text-4xl font-semibold text-white mb-6">Privacy Policy</h1>
        <p className="text-lg text-gray-300 mb-4">
          At Meraki, we take your privacy seriously. This Privacy Policy describes how we collect, use, and protect
          your personal information when you use our website.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-6 mb-3">Information We Collect</h2>
        <p className="text-lg text-gray-300 mb-4">
          We collect the following information:
        </p>
        <ul className="list-disc pl-8 text-gray-300 mb-4">
          <li>Personal information you provide when registering or using our services (e.g., name, email, etc.).</li>
          <li>Usage data (e.g., browsing activity, IP address, etc.).</li>
          <li>Payment information for transactions (if applicable).</li>
        </ul>

        <h2 className="text-2xl font-semibold text-white mt-6 mb-3">How We Use Your Information</h2>
        <p className="text-lg text-gray-300 mb-4">
          We use your information for the following purposes:
        </p>
        <ul className="list-disc pl-8 text-gray-300 mb-4">
          <li>To provide and personalize our services.</li>
          <li>To communicate with you about your account or services.</li>
          <li>To process payments and transactions.</li>
          <li>To improve our website and services.</li>
          <li>To comply with legal obligations and enforce our terms of service.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-white mt-6 mb-3">How We Protect Your Information</h2>
        <p className="text-lg text-gray-300 mb-4">
          We use industry-standard security measures to protect your personal information, including encryption and secure
          data storage practices. However, no method of transmission over the internet is completely secure, and we cannot
          guarantee the absolute security of your information.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-6 mb-3">Sharing Your Information</h2>
        <p className="text-lg text-gray-300 mb-4">
          We may share your information with third parties in the following circumstances:
        </p>
        <ul className="list-disc pl-8 text-gray-300 mb-4">
          <li>With service providers who assist us in operating our website and services.</li>
          <li>If required by law or in response to legal requests from authorities.</li>
          <li>In the event of a business transaction, such as a merger or acquisition.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-white mt-6 mb-3">Your Rights and Choices</h2>
        <p className="text-lg text-gray-300 mb-4">
          You have the right to:
        </p>
        <ul className="list-disc pl-8 text-gray-300 mb-4">
          <li>Access, update, or delete your personal information.</li>
          <li>Opt-out of receiving marketing communications.</li>
          <li>Request that we restrict the processing of your personal data in certain situations.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-white mt-6 mb-3">Cookies</h2>
        <p className="text-lg text-gray-300 mb-4">
          We use cookies to enhance your experience on our website. You can control the use of cookies through your browser
          settings. However, disabling cookies may affect your ability to use certain features of our site.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-6 mb-3">Changes to This Privacy Policy</h2>
        <p className="text-lg text-gray-300 mb-4">
          We may update this Privacy Policy from time to time. When we make changes, we will post the updated policy on this
          page and update the "Last Updated" date at the bottom. We encourage you to review this page periodically for any
          updates.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-6 mb-3">Contact Us</h2>
        <p className="text-lg text-gray-300 mb-4">
          If you have any questions or concerns about this Privacy Policy, please contact us at:
        </p>
        <p className="text-lg text-gray-300 mb-4">
          <strong>Email:</strong> support@meraki.com
        </p>
        <p className="text-lg text-gray-300 mb-4">
          <strong>Phone:</strong> 1-800-123-4567
        </p>

        <p className="text-sm text-gray-500 mt-8">Last Updated: October 2024</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
