import { useState } from "react";
import { X, Check } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertStressAssessmentSchema } from "@shared/schema";
import type { InsertStressAssessment } from "@shared/schema";

interface StressAssessmentProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (results: any) => void;
  sessionId: string;
}

const questions = [
  {
    id: "question1",
    text: "Dalam skala 1 (Sangat Buruk) hingga 5 (Sangat Baik), bagaimana perasaan Anda saat ini?",
    lowLabel: "Sangat Buruk",
    highLabel: "Sangat Baik"
  },
  {
    id: "question2", 
    text: "Seberapa sering Anda merasa cemas atau khawatir dalam beberapa jam terakhir?",
    lowLabel: "Tidak Pernah",
    highLabel: "Sangat Sering"
  },
  {
    id: "question3",
    text: "Apakah Anda merasa memiliki energi untuk beraktivitas?",
    lowLabel: "Tidak Berenergi",
    highLabel: "Sangat Berenergi"
  },
  {
    id: "question4",
    text: "Seberapa sulit bagi Anda untuk berkonsentrasi hari ini?",
    lowLabel: "Sangat Mudah",
    highLabel: "Sangat Sulit"
  },
  {
    id: "question5",
    text: "Seberapa terbebani Anda dengan tanggung jawab saat ini?",
    lowLabel: "Tidak Terbebani", 
    highLabel: "Sangat Terbebani"
  }
];

export default function StressAssessment({ isOpen, onClose, onComplete, sessionId }: StressAssessmentProps) {
  const { toast } = useToast();
  
  const form = useForm<InsertStressAssessment>({
    resolver: zodResolver(insertStressAssessmentSchema),
    defaultValues: {
      sessionId,
      question1: 0,
      question2: 0,
      question3: 0,
      question4: 0,
      question5: 0,
    },
  });

  const assessmentMutation = useMutation({
    mutationFn: async (data: InsertStressAssessment) => {
      const response = await apiRequest("POST", "/api/stress/assess", data);
      return response.json();
    },
    onSuccess: (data) => {
      onComplete(data);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal menyimpan hasil evaluasi. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: InsertStressAssessment) => {
    // Check if all questions are answered
    const hasAllAnswers = [data.question1, data.question2, data.question3, data.question4, data.question5]
      .every(answer => answer >= 1 && answer <= 5);
    
    if (!hasAllAnswers) {
      toast({
        title: "Mohon lengkapi semua pertanyaan",
        description: "Silakan jawab semua pertanyaan untuk mendapatkan hasil yang akurat.",
        variant: "destructive",
      });
      return;
    }

    assessmentMutation.mutate(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-card-foreground">Evaluasi Tingkat Stres</h3>
            <button 
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="button-close-assessment"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-muted-foreground mt-2">
            Jawab pertanyaan berikut untuk membantu kami memahami kondisi Anda saat ini.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-8">
          {questions.map((question, index) => (
            <div key={question.id} className="space-y-4">
              <h4 className="font-medium text-card-foreground">
                {index + 1}. {question.text}
              </h4>
              <div className="flex justify-between items-center space-x-2">
                <span className="text-sm text-muted-foreground">{question.lowLabel}</span>
                <div className="flex space-x-3">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <label key={value} className="flex flex-col items-center space-y-1 cursor-pointer">
                      <input 
                        {...form.register(question.id as keyof InsertStressAssessment, {
                          setValueAs: (v) => parseInt(v)
                        })}
                        type="radio" 
                        value={value} 
                        className="text-primary focus:ring-ring"
                        data-testid={`radio-${question.id}-${value}`}
                      />
                      <span className="text-sm text-muted-foreground">{value}</span>
                    </label>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">{question.highLabel}</span>
              </div>
            </div>
          ))}

          <div className="pt-4">
            <button 
              type="submit"
              disabled={assessmentMutation.isPending}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              data-testid="button-submit-assessment"
            >
              {assessmentMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check size={16} />
                  <span>Lihat Hasil Evaluasi</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
