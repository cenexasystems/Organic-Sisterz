import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-primary font-body antialiased selection:bg-secondary-container selection:text-on-secondary-container flex flex-col">
      <Helmet>
        <title>Privacy Policy | Organic Sisterz</title>
      </Helmet>
      
      <Navbar
        onConsultationClick={() => {}}
        onAdminClick={() => navigate("/admin")}
        onGiftClick={() => navigate("/gift")}
      />

      <main className="flex-grow pt-32 pb-16 px-6 lg:px-12">
        <div className="max-w-3xl mx-auto prose prose-green prose-headings:font-display prose-headings:text-primary prose-p:text-on-surface-variant prose-li:text-on-surface-variant">
          <h1 className="text-4xl font-bold mb-4 font-display text-primary">Privacy Policy</h1>
          <p className="text-sm text-on-surface-variant mb-12"><strong>Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong></p>

          <p>
            Organic Sisterz ("we," "us," or "our") operates organicsisterz.com (the "Site"). This Privacy Policy explains how we collect, use, disclose, and protect your information when you visit our Site, create an account, or place an order.
          </p>
          <p>
            By using our Site, you agree to the collection and use of information as described in this policy.
          </p>

          <hr className="my-8 border-outline-variant/30" />

          <h2>1. Information We Collect</h2>
          
          <h3>1.1 Information You Provide During Sign-Up</h3>
          <p>When you create an account, we collect:</p>
          <ul>
            <li>Full name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Password (stored in encrypted/hashed form)</li>
            <li>Any other details requested during registration (e.g., date of birth, gender, address)</li>
          </ul>

          <h3>1.2 Information Collected During Ordering</h3>
          <p>When you place an order, we additionally collect:</p>
          <ul>
            <li>Billing and shipping address</li>
            <li>Order details (items purchased, quantity, price)</li>
            <li>Payment information (card details are processed securely by our third-party payment gateway; we do not store full card numbers)</li>
            <li>Transaction history</li>
          </ul>

          <h3>1.3 Automatically Collected Information</h3>
          <p>When you visit our Site, we may automatically collect:</p>
          <ul>
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Device information</li>
            <li>Pages visited, time spent, and referring URLs</li>
            <li>Cookies and similar tracking technologies (see Section 5)</li>
          </ul>

          <hr className="my-8 border-outline-variant/30" />

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Create and manage your account</li>
            <li>Process and fulfill orders, including shipping and delivery</li>
            <li>Send order confirmations, invoices, and shipping updates</li>
            <li>Respond to customer service requests and inquiries</li>
            <li>Send promotional emails or offers (only if you've opted in; you can unsubscribe anytime)</li>
            <li>Improve our Site, products, and services</li>
            <li>Detect and prevent fraud or unauthorized transactions</li>
            <li>Comply with legal obligations</li>
          </ul>

          <hr className="my-8 border-outline-variant/30" />

          <h2>3. How We Share Your Information</h2>
          <p>We do not sell your personal information. We may share your information with:</p>
          <ul>
            <li><strong>Payment processors</strong> (e.g., Razorpay, Stripe, PayPal) to complete transactions</li>
            <li><strong>Shipping and logistics partners</strong> to deliver your orders</li>
            <li><strong>Service providers</strong> who help us operate the Site (hosting, analytics, email services)</li>
            <li><strong>Legal authorities</strong> if required by law, court order, or to protect our rights</li>
          </ul>
          <p>All third parties are required to handle your data securely and only for the purposes we specify.</p>

          <hr className="my-8 border-outline-variant/30" />

          <h2>4. Data Storage and Security</h2>
          <p>
            We use industry-standard measures (encryption, secure servers, restricted access) to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
          </p>
          <p>
            We retain your information for as long as your account is active or as needed to provide services, comply with legal obligations, resolve disputes, and enforce our agreements.
          </p>

          <hr className="my-8 border-outline-variant/30" />

          <h2>5. Cookies and Tracking</h2>
          <p>We use cookies and similar technologies to:</p>
          <ul>
            <li>Keep you logged in</li>
            <li>Remember items in your cart</li>
            <li>Understand how visitors use our Site (analytics)</li>
            <li>Show relevant offers or ads</li>
          </ul>
          <p>
            You can control or disable cookies through your browser settings, though some features of the Site may not function properly without them.
          </p>

          <hr className="my-8 border-outline-variant/30" />

          <h2>6. Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul>
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your account and data</li>
            <li>Opt out of marketing communications</li>
            <li>Withdraw consent for data processing (where applicable)</li>
          </ul>
          <p>To exercise any of these rights, contact us at organicsisterz@gmail.com.</p>

          <hr className="my-8 border-outline-variant/30" />

          <h2>7. Children's Privacy</h2>
          <p>
            Our Site is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we learn we have collected such information, we will delete it promptly.
          </p>

          <hr className="my-8 border-outline-variant/30" />

          <h2>8. Third-Party Links</h2>
          <p>
            Our Site may contain links to third-party websites. We are not responsible for the privacy practices of those sites and encourage you to review their privacy policies separately.
          </p>

          <hr className="my-8 border-outline-variant/30" />

          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The updated version will be posted on this page with a revised "Last Updated" date. Continued use of the Site after changes constitutes acceptance of the updated policy.
          </p>

          <hr className="my-8 border-outline-variant/30" />

          <h2>10. Contact Us</h2>
          <p>If you have questions or concerns about this Privacy Policy or how we handle your data, contact us at:</p>
          <p>
            <strong>Organic Sisterz</strong><br />
            Email: organicsisterz@gmail.com<br />
            Phone: +91 9500258080<br />
            Address: No. 42, Lotus Avenue, Greenways Road, Chennai - 600028
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
