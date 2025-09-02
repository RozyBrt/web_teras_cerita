import { useState } from "react";
import { X, Phone, Check } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertEmergencyRequestSchema } from "@shared/schema";
import type { InsertEmergencyRequest } from "@shared/schema";

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EmergencyModal({ isOpen, onClose, onSuccess }: EmergencyModalProps) {
  const { toast } = useToast();
  
  const form = useForm<InsertEmergencyRequest>({
    resolver: zodResolver(insertEmergencyRequestSchema),
    defaultValues: {
      name: "",
      contact: "",
      message: "",
    },
  });

  const emergencyMutation = useMutation({
    mutationFn: async (data: InsertEmergencyRequest) => {
      const response = await apiRequest("POST", "/api/emergency", data);
      return response.json();
    },
    onSuccess: () => {
      form.reset();
      onSuccess();
      toast({
        title: "Pesan Terkirim",
        description: "Tim kami akan segera menghubungi Anda. Terima kasih telah mempercayai kami.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal mengirim permintaan bantuan. Silakan coba lagi atau hubungi 119.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: InsertEmergencyRequest) => {
    emergencyMutation.mutate(data);
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg mx-auto">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                <Phone className="text-destructive" size={20} />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground">Butuh Bicara Sekarang?</h3>
            </div>
            <button 
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="button-close-emergency"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
          <p className="text-muted-foreground">
            Tim kami akan segera menghubungi Anda. Mohon isi informasi di bawah ini.
          </p>

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-card-foreground mb-2">
                Nama (Opsional)
              </label>
              <input 
                {...form.register("name")}
                type="text" 
                id="name"
                className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Masukkan nama Anda"
                data-testid="input-emergency-name"
              />
            </div>

            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-card-foreground mb-2">
                Email atau Nomor Telepon *
              </label>
              <input 
                {...form.register("contact")}
                type="text" 
                id="contact"
                className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="email@example.com atau 081234567890"
                data-testid="input-emergency-contact"
              />
              {form.formState.errors.contact && (
                <p className="text-destructive text-sm mt-1">{form.formState.errors.contact.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-card-foreground mb-2">
                Pesan Singkat (Opsional)
              </label>
              <textarea 
                {...form.register("message")}
                id="message"
                rows={3}
                className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder="Ceritakan apa yang bisa kami bantu..."
                data-testid="textarea-emergency-message"
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <button 
              type="button"
              onClick={handleClose}
              className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium py-3 px-6 rounded-lg transition-colors"
              data-testid="button-cancel-emergency"
            >
              Batal
            </button>
            <button 
              type="submit"
              disabled={emergencyMutation.isPending}
              className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              data-testid="button-submit-emergency"
            >
              {emergencyMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-destructive-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check size={16} />
                  <span>Kirim Permintaan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
