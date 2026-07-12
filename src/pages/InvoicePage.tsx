import { useEffect, useState } from "react";
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from "react-router-dom";
import { fetchOrderById } from "../utils/db";
import type { Order } from "../utils/store";
import {  MapPin, Phone, Printer, Copy, Check } from "lucide-react";

export default function InvoicePage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      if (!id) {
        setError(true);
        setLoading(false);
        return;
      }
      const data = await fetchOrderById(id);
      if (!data) {
        setError(true);
      } else {
        setOrder(data);
        document.title = `Invoice - ${data.id}`;
      }
      setLoading(false);
    };

    loadOrder();
  }, [id]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-white border border-[#2B3E2F]/20 overflow-hidden">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <p className="text-[#2B3E2F] font-bold tracking-widest uppercase text-sm font-display">Generating Digital Bill...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex flex-col items-center justify-center gap-4">
        <p className="text-red-700 font-bold text-xl font-display">Invoice Not Found</p>
        <Link to="/" className="px-6 py-2 bg-[#2B3E2F] hover:bg-[#1B3022] rounded-lg text-white font-bold transition-colors">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0FDF4] text-[#1B3022] font-sans py-12 px-4 print:p-0 print:bg-white flex flex-col items-center">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <style>{`
        @media print {
          @page { margin: 10mm; }
          body { background-color: white !important; color: black !important; padding: 0 !important; margin: 0 !important; }
        }
      `}</style>
      
      {/* Top Navigation / Action Bar (Hidden when printing) */}
      <div className="w-full max-w-3xl flex justify-end items-center mb-8 print:hidden gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleCopyLink}
            className="flex items-center gap-2 bg-white hover:bg-[#FAF9F5] text-[#2B3E2F] font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-lg shadow-sm border border-[#E5E0D8] transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-600" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy Link
              </>
            )}
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-[#2B3E2F] hover:bg-[#1B3022] text-white font-bold text-xs uppercase tracking-wider px-5 py-2 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Download PDF / Print
          </button>
        </div>
      </div>

      {/* The Invoice Document */}
      <div className="w-full max-w-3xl bg-white border border-[#E5E0D8] rounded-2xl shadow-xl print:shadow-none print:border-none print:rounded-none overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-[#FAF9F5] border-b border-[#E5E0D8] p-8 sm:p-12 print:p-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 flex items-center justify-center mb-4 rounded-full overflow-hidden border border-[#E5E0D8] shadow-sm">
            <img src="/logo.jpg" alt="Organic Sisterz Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-black text-[#1B3022] tracking-tight font-display">Organic Sisterz</h1>
          <p className="text-xs text-[#8F9974] font-bold tracking-wider mt-1 mb-4 uppercase">INVOICE: {order.id}</p>
          
          <div className="flex flex-col items-center gap-2 text-sm text-[#4B5563] font-medium">
            <div className="text-center max-w-md leading-relaxed">
              <span className="inline-block text-[#2B3E2F] mr-1.5 align-middle -mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
              </span>
              <span>Organic Sisterz, No. 42, Lotus Avenue, Greenways Road, Chennai - 600028</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center mt-1">
              <Phone className="w-3.5 h-3.5 text-[#2B3E2F] shrink-0" />
              <span>+91 95002 58080</span>
            </div>
          </div>
        </div>

        {/* Invoice Meta Data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-8 sm:p-12 print:p-6 border-b border-[#E5E0D8]/50">
          <div>
            <h3 className="text-[10px] font-bold text-[#8F9974] uppercase tracking-[0.2em] mb-3">Billed To</h3>
            <p className="text-base font-bold text-[#1B3022]">{order.customerName || "Guest Customer"}</p>
            {order.customerPhone && (
              <p className="text-sm text-[#4B5563] font-medium mt-1">+91 {order.customerPhone.split("_")[0]}</p>
            )}
          </div>
          <div className="sm:text-right flex flex-col sm:items-end">
            <h3 className="text-[10px] font-bold text-[#8F9974] uppercase tracking-[0.2em] mb-3 self-start sm:self-auto">Order Details</h3>
            <div className="inline-block text-left text-sm space-y-1">
              <div className="flex gap-2">
                <span className="text-[#8F9974] font-bold w-12 text-left sm:text-right">Date:</span>
                <span className="text-[#1B3022] font-bold">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-[#8F9974] font-bold w-12 text-left sm:text-right">Time:</span>
                <span className="text-[#1B3022] font-bold">{new Date(order.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-[#8F9974] font-bold w-12 text-left sm:text-right">Type:</span>
                <span className="text-[#1B3022] font-bold uppercase">{order.source} SALE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="p-8 sm:p-12 print:py-4 print:px-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-[#E5E0D8]">
                <th className="py-4 text-[11px] font-bold text-[#8F9974] uppercase tracking-wider">Item Description</th>
                <th className="py-4 text-[11px] font-bold text-[#8F9974] uppercase tracking-wider text-center">Qty</th>
                <th className="py-4 text-[11px] font-bold text-[#8F9974] uppercase tracking-wider text-right">Price</th>
                <th className="py-4 text-[11px] font-bold text-[#8F9974] uppercase tracking-wider text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E0D8]/40">
              {order.items.map((item, index) => (
                <tr key={index} className="group">
                  <td className="py-6 pr-4 print:py-3">
                    <p className="text-sm font-bold text-[#1B3022]">
                      {item.name}
                      {item.size && item.size !== '—' && ` - ${item.size}`}
                    </p>
                  </td>
                  <td className="py-6 px-4 print:py-3 text-center text-sm font-bold text-[#4B5563]">{item.quantity}</td>
                  <td className="py-6 pl-4 print:py-3 text-right text-sm font-bold text-[#4B5563]">₹{item.price.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                  <td className="py-6 pl-4 print:py-3 text-right text-sm font-black text-[#1B3022]">₹{(item.price * item.quantity).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="bg-[#FAF9F5] border-t border-[#E5E0D8] p-8 sm:p-12 print:p-6 flex justify-end">
            <div className="w-full sm:w-1/2 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#8F9974] font-bold uppercase tracking-wider">Subtotal</span>
                <span className="font-bold text-[#1B3022]">₹{order.subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
              
              {(order.couponDiscount || 0) > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#8F9974] font-bold uppercase tracking-wider">
                    Coupon ({order.couponCode})
                  </span>
                  <span className="font-bold text-[#E11D48]">-₹{(order.couponDiscount || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
              )}

              {(order.manualDiscount || 0) > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#8F9974] font-bold uppercase tracking-wider">
                    Manual Discount
                  </span>
                  <span className="font-bold text-[#E11D48]">-₹{(order.manualDiscount || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
              )}

              {(order.deliveryCharge || 0) > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#8F9974] font-bold uppercase tracking-wider">Delivery Fee</span>
                  <span className="font-bold text-[#1B3022]">₹{(order.deliveryCharge || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
              )}

              <div className="border-t border-[#E5E0D8] pt-4 mt-2 flex justify-between items-center">
                <span className="text-sm font-black text-[#2B3E2F] uppercase tracking-widest">Total Amount</span>
                <span className="text-3xl font-black text-[#1B3022] font-display">₹{order.totalPrice.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>

              {((order.cashReceived || 0) > 0) && (
                <>
                  <div className="flex justify-between items-center text-sm pt-2">
                    <span className="text-[#8F9974] font-bold uppercase tracking-wider">Cash Paid</span>
                    <span className="font-bold text-[#1B3022]">₹{(order.cashReceived || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#8F9974] font-bold uppercase tracking-wider">Change Return</span>
                    <span className="font-bold text-[#1B3022]">₹{(order.changeReturned || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
                </>
              )}
            </div>
        </div>
        
        {/* Footer */}
        <div className="border-t border-[#E5E0D8]/60 p-6 print:p-4 text-center bg-[#F8F5F0] flex flex-col items-center justify-center gap-1.5">
          <p className="text-xs font-bold text-[#2B3E2F] tracking-wider uppercase font-display">Thank you for shopping with us!</p>
        <div className="flex justify-center items-center gap-1.5 opacity-90 text-[10px] text-[#8F9974] uppercase tracking-widest mt-1">
          <span>Powered by</span>
          <a
            href="https://cenexasystems.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-xs tracking-wide font-bold hover:text-[#1B3022] transition-colors text-[#2B3E2F]"
          >
            Cenexa Systems
          </a>{" "}
          © {new Date().getFullYear()}
        </div>
        </div>

      </div>
    </div>
  );
}
