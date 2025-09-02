import { Check } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md mx-auto">
        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Check className="text-primary text-2xl" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-card-foreground">Pesan Terkirim</h3>
          <p className="text-muted-foreground">
            Tim kami akan segera menghubungi Anda. Terima kasih telah mempercayai kami.
          </p>
          <button 
            onClick={onClose}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-6 rounded-lg transition-colors"
            data-testid="button-close-success"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
