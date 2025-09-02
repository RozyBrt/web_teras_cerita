import { useEffect, useState } from "react";
import { X, MessageCircle, Home, Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getStressDescription, getStressColor } from "@/lib/stress-utils";

interface StressResultsProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onShowResources: () => void;
  results: any;
}

export default function StressResults({ isOpen, onClose, onNewChat, onShowResources, results }: StressResultsProps) {
  const [showProfessionalHelp, setShowProfessionalHelp] = useState(false);

  const { data: historyData } = useQuery({
    queryKey: ["/api/stress/history"],
    enabled: isOpen && !!results,
  });

  useEffect(() => {
    if (results && results.stressScore > 50) {
      setShowProfessionalHelp(true);
    }
  }, [results]);

  if (!isOpen || !results) return null;

  const { stressScore, stressLevel } = results;
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (stressScore / 100) * circumference;
  const stressColor = getStressColor(stressScore);
  const description = getStressDescription(stressScore);

  // Prepare historical data for chart
  const historyAssessments = (historyData as any)?.assessments || [];
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  const dayLabels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Ming'];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-xl mx-auto">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-card-foreground">Hasil Evaluasi Stres</h3>
            <button 
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="button-close-results"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Stress Level Indicator */}
          <div className="text-center space-y-4">
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(214, 32%, 91%)" strokeWidth="8"/>
                <circle 
                  cx="50" cy="50" r="40" 
                  fill="none" 
                  stroke={stressColor}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground" data-testid="text-stress-score">
                    {stressScore}
                  </div>
                  <div className="text-sm text-muted-foreground">dari 100</div>
                </div>
              </div>
            </div>

            <div>
              <div className="text-2xl font-semibold text-foreground mb-2" data-testid="text-stress-level">
                Tingkat Stres: {stressLevel}
              </div>
              <p className="text-muted-foreground" data-testid="text-stress-description">
                {description}
              </p>
            </div>
          </div>

          {/* Historical Chart */}
          <div className="bg-muted/50 rounded-lg p-6">
            <h4 className="font-medium text-card-foreground mb-4">Riwayat Tingkat Stres (7 Hari Terakhir)</h4>
            <div className="flex items-end justify-between h-32 space-x-2">
              {last7Days.map((date, index) => {
                // Find assessment for this day
                const dayAssessment = historyAssessments.find((assessment: any) => {
                  const assessmentDate = new Date(assessment.completedAt);
                  return assessmentDate.toDateString() === date.toDateString();
                });
                
                const dayScore = dayAssessment?.stressScore || 0;
                const height = Math.max(10, (dayScore / 100) * 80); // Min 10% height
                const isToday = index === 6;
                
                return (
                  <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                    <div className="w-full bg-primary/20 rounded-t-sm relative" style={{ height: '80px' }}>
                      <div 
                        className={`absolute bottom-0 w-full rounded-t-sm stress-bar ${getStressColor(dayScore) === 'hsl(158, 64%, 52%)' ? 'bg-primary' : dayScore > 50 ? 'bg-orange-400' : 'bg-primary'}`}
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <span className={`text-xs ${isToday ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                      {isToday ? 'Hari Ini' : dayLabels[index]}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Rendah</span>
              <span>Sedang</span>
              <span>Tinggi</span>
            </div>
          </div>

          {/* Professional Help Offer */}
          {showProfessionalHelp && (
            <div className="bg-accent rounded-lg p-6 border border-orange-200">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="text-orange-600 text-sm" size={16} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-card-foreground mb-2">
                    Kami melihat Anda mungkin sedang melewati masa yang berat
                  </h4>
                  <p className="text-muted-foreground text-sm mb-4">
                    Jika Anda merasa butuh bantuan lebih lanjut, kami bisa membantu Anda terhubung dengan profesional. 
                    Apakah Anda ingin melihat daftar sumber daya bantuan profesional?
                  </p>
                  <div className="flex space-x-3">
                    <button 
                      onClick={onShowResources}
                      className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                      data-testid="button-show-resources"
                    >
                      Ya, Saya Mau
                    </button>
                    <button 
                      onClick={() => setShowProfessionalHelp(false)}
                      className="bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                      data-testid="button-not-now"
                    >
                      Tidak Sekarang
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <button 
              onClick={onClose}
              className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              data-testid="button-back-home"
            >
              <Home size={16} />
              <span>Kembali ke Beranda</span>
            </button>
            <button 
              onClick={onNewChat}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              data-testid="button-new-chat"
            >
              <MessageCircle size={16} />
              <span>Chat Lagi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
