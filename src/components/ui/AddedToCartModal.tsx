import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AddedToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    name: string;
    size: string;
    price: number;
    quantity: number;
  } | null;
}

export default function AddedToCartModal({ isOpen, onClose, item }: AddedToCartModalProps) {
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate("/cart");
  };
  const handleContinueShopping = () => {
    onClose();
    setTimeout(() => {
      navigate('/#products-catalog');
    }, 10);
  };

  return (
    <AnimatePresence>
      {isOpen && item && (
        <div className="fixed inset-0 z-[100] flex p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative m-auto w-full max-w-md bg-[#FAF9F5] rounded-3xl shadow-xl overflow-hidden z-10 p-6 md:p-8"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-[#4A5D23]/60 hover:text-[#4A5D23] transition-colors rounded-full hover:bg-[#4A5D23]/5"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center mb-6 mt-2">
              <div className="w-16 h-16 bg-[#4A5D23]/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-[#4A5D23]" />
              </div>
              <h3 className="font-heading text-2xl text-[#2C3B14] mb-2">Added to Cart!</h3>
              <p className="text-[#4A5D23]/80">You've successfully added this item to your cart.</p>
            </div>

            <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-[#4A5D23]/10">
              <div className="flex items-center justify-between gap-4">
                <div className="text-left flex-1">
                  <h4 className="font-heading text-[#2C3B14] text-lg leading-tight">{item.name}</h4>
                  <p className="text-sm text-[#4A5D23]/70 mt-1">Size: {item.size}</p>
                </div>
                <div className="text-right whitespace-nowrap">
                  <p className="font-medium text-[#2C3B14]">₹{item.price}</p>
                  <p className="text-sm text-[#4A5D23]/70">Qty: {item.quantity}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleContinueShopping}
                className="w-full bg-white text-[#4A5D23] py-4 rounded-full font-medium border border-[#4A5D23]/20 hover:bg-[#4A5D23]/5 transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={handleCheckout}
                className="w-full bg-[#4A5D23] text-white py-4 rounded-full font-medium hover:bg-[#3A4A1B] transition-colors shadow-lg shadow-[#4A5D23]/20"
              >
                Proceed to Checkout
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
