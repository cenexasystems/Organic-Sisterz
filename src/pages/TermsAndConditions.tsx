import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function TermsAndConditions() {
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-primary font-body antialiased selection:bg-secondary-container selection:text-on-secondary-container flex flex-col">
      <Helmet>
        <title>Terms and Conditions | Organic Sisterz</title>
      </Helmet>
      
      <Navbar
        onConsultationClick={() => {}}
        onAdminClick={() => navigate("/admin")}
        onGiftClick={() => navigate("/gift")}
      />

      <main className="flex-grow pt-32 pb-16 px-6 lg:px-12">
        <div className="max-w-3xl mx-auto prose prose-green prose-headings:font-display prose-headings:text-primary prose-p:text-on-surface-variant prose-li:text-on-surface-variant">
          <h1 className="text-4xl font-bold mb-4 font-display text-primary">Terms and Conditions</h1>
          <p className="text-sm text-on-surface-variant mb-12"><strong>Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong></p>

          <p>
            Welcome to organicsisterz.com (the "Site"), operated by Organic Sisterz ("we," "us," or "our"). These Terms and Conditions ("Terms") govern your access to and use of the Site, including any account registration and orders placed through it.
          </p>
          <p>
            By accessing or using the Site, you agree to be bound by these Terms. If you do not agree, please do not use the Site.
          </p>

          <hr className="my-8 border-outline-variant/30" />

          <h2>1. Eligibility</h2>
          <p>
            You must be at least 18 years old, or the age of majority in your jurisdiction, to create an account or place an order on this Site. By using the Site, you confirm that you meet this requirement.
          </p>

          <hr className="my-8 border-outline-variant/30" />

          <h2>2. Account Registration</h2>
          <ul>
            <li>You must provide accurate, current, and complete information during sign-up.</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You are responsible for all activities that occur under your account.</li>
            <li>We reserve the right to suspend or terminate accounts that provide false information or violate these Terms.</li>
          </ul>

          <hr className="my-8 border-outline-variant/30" />

          <h2>3. Orders and Purchases</h2>
          <ul>
            <li>All orders placed through the Site are subject to acceptance and availability.</li>
            <li>We reserve the right to refuse or cancel any order for reasons including but not limited to product unavailability, pricing errors, or suspected fraud.</li>
            <li>Order confirmation via email does not guarantee acceptance; a separate shipping confirmation indicates order acceptance.</li>
          </ul>

          <hr className="my-8 border-outline-variant/30" />

          <h2>4. Pricing and Payment</h2>
          <ul>
            <li>All prices are listed in INR and are subject to change without prior notice.</li>
            <li>Prices do not include applicable taxes or shipping fees unless stated otherwise.</li>
            <li>Payment must be made in full at the time of order through the payment methods available on the Site.</li>
            <li>We use third-party payment gateways to process payments securely; we do not store your full payment card details.</li>
          </ul>

          <hr className="my-8 border-outline-variant/30" />

          <h2>5. Shipping and Delivery</h2>
          <ul>
            <li>Estimated delivery times are provided for reference and are not guaranteed.</li>
            <li>Risk of loss and title for products pass to you upon delivery to the shipping carrier.</li>
            <li>We are not responsible for delays caused by the shipping carrier, customs, or circumstances beyond our control.</li>
          </ul>

          <hr className="my-8 border-outline-variant/30" />

          <h2>6. Returns, Refunds, and Cancellations</h2>
          <ul>
            <li>Products may be returned within 7 days of delivery.</li>
            <li>Products must be unused, in original packaging, and accompanied by proof of purchase to be eligible for a return.</li>
            <li>Refunds will be processed to the original payment method within 7 business days of receiving the returned item.</li>
            <li>Certain products (e.g., perishable goods, customized items) may be non-returnable — such exclusions will be noted on the product page.</li>
          </ul>

          <hr className="my-8 border-outline-variant/30" />

          <h2>7. User Conduct</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Site for any unlawful purpose</li>
            <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
            <li>Post or transmit harmful code, viruses, or malicious content</li>
            <li>Interfere with the proper functioning of the Site</li>
            <li>Provide false information during sign-up or ordering</li>
          </ul>

          <hr className="my-8 border-outline-variant/30" />

          <h2>8. Intellectual Property</h2>
          <p>
            All content on the Site — including text, graphics, logos, images, and software — is the property of Organic Sisterz or its licensors and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our prior written consent.
          </p>

          <hr className="my-8 border-outline-variant/30" />

          <h2>9. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Organic Sisterz shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Site or products purchased, including but not limited to loss of data, revenue, or profits.
          </p>
          <p>
            Our total liability for any claim arising from your use of the Site or a purchased product shall not exceed the amount you paid for the relevant order.
          </p>

          <hr className="my-8 border-outline-variant/30" />

          <h2>10. Disclaimer of Warranties</h2>
          <p>
            The Site and products are provided on an "as is" and "as available" basis without warranties of any kind, either express or implied, including but not limited to merchantability, fitness for a particular purpose, and non-infringement.
          </p>

          <hr className="my-8 border-outline-variant/30" />

          <h2>11. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Organic Sisterz, its employees, and affiliates from any claims, damages, or expenses arising from your violation of these Terms or misuse of the Site.
          </p>

          <hr className="my-8 border-outline-variant/30" />

          <h2>12. Governing Law and Jurisdiction</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of Chennai, India.
          </p>

          <hr className="my-8 border-outline-variant/30" />

          <h2>13. Changes to These Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. Updates will be posted on this page with a revised "Last Updated" date. Continued use of the Site after changes constitutes acceptance of the revised Terms.
          </p>

          <hr className="my-8 border-outline-variant/30" />

          <h2>14. Contact Us</h2>
          <p>For any questions regarding these Terms, please contact:</p>
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
