import { useState } from "react";
import { Heart, Leaf, Phone, MessageCircle, BarChart3, Users } from "lucide-react";
import ChatOverlay from "@/components/chat-overlay";
import EmergencyModal from "@/components/emergency-modal";
import StressAssessment from "@/components/stress-assessment";
import StressResults from "@/components/stress-results";
import ProfessionalResources from "@/components/professional-resources";
import SuccessModal from "@/components/success-modal";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isStressAssessmentOpen, setIsStressAssessmentOpen] = useState(false);
  const [isStressResultsOpen, setIsStressResultsOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [stressResults, setStressResults] = useState<any>(null);

  const handleStartChat = () => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setCurrentSessionId(sessionId);
    setIsChatOpen(true);
  };

  const handleEndSession = () => {
    setIsChatOpen(false);
    setTimeout(() => setIsStressAssessmentOpen(true), 300);
  };

  const handleAssessmentComplete = (results: any) => {
    setStressResults(results);
    setIsStressAssessmentOpen(false);
    setTimeout(() => setIsStressResultsOpen(true), 300);
  };

  const handleEmergencySuccess = () => {
    setIsEmergencyOpen(false);
    setTimeout(() => setIsSuccessOpen(true), 300);
  };

  const handleNewChat = () => {
    setIsStressResultsOpen(false);
    setTimeout(() => handleStartChat(), 300);
  };

  const handleShowResources = () => {
    setIsStressResultsOpen(false);
    setTimeout(() => setIsResourcesOpen(true), 300);
  };

  const handleBackToResults = () => {
    setIsResourcesOpen(false);
    setTimeout(() => setIsStressResultsOpen(true), 300);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFeatureClick = (feature: string) => {
    switch (feature) {
      case 'chat':
        handleStartChat();
        break;
      case 'stress':
        setIsStressAssessmentOpen(true);
        break;
      case 'professional':
        setIsResourcesOpen(true);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Navigation */}
      <header className="w-full bg-card/50 backdrop-blur-sm border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <img src="/assets/images/logo_teras.png" alt="Logo Teras Cerita" className="h-full w-full object-contain" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">Teras Cerita</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => scrollToSection('tentang')}
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="nav-about"
              >
                Tentang
              </button>
              <button 
                onClick={() => scrollToSection('sumber-daya')}
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="nav-resources"
              >
                Sumber Daya
              </button>
              <button 
                onClick={() => scrollToSection('kontak')}
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="nav-contact"
              >
                Kontak
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-secondary/30"></div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="breathing-animation mb-12">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="text-primary text-2xl" size={32} />
                <img src="/assets/images/logo_teras.png" alt="Logo Teras Cerita" className="h-full w-full object-contain p-2" />
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-light text-foreground mb-6 leading-tight">
              Selamat datang di <br />
              <span className="font-semibold text-primary">Teras Cerita</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Ambil napas dalam. Anda tidak sendirian. <br />
              Mari temukan ketenangan bersama dalam ruang yang aman ini.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <button 
                onClick={handleStartChat}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
                data-testid="button-start-chat"
              >
                <MessageCircle size={20} />
                <span>Mulai Chat Positif</span>
              </button>
              
              <button 
                onClick={() => setIsEmergencyOpen(true)}
                className="w-full sm:w-auto bg-destructive hover:bg-destructive/90 text-destructive-foreground font-medium py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
                data-testid="button-emergency-contact"
              >
                <Phone size={20} />
                <span>Butuh Bicara Sekarang?</span>
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="tentang" className="py-20 bg-muted/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-semibold text-foreground mb-4">
                Kami Hadir Untuk Anda
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Teras Cerita menyediakan dukungan emosional yang aman dan mudah diakses kapan saja Anda membutuhkannya.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <button 
                onClick={() => handleFeatureClick('chat')}
                className="bg-card rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 text-left group"
                data-testid="feature-chat"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <MessageCircle className="text-primary text-xl" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-3">AI Pendamping</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Dapatkan afirmasi positif dan dukungan emosional dari AI yang empatik dan suportif kapan saja.
                </p>
                <span className="text-primary text-sm font-medium group-hover:underline">
                  Mulai Chat →
                </span>
              </button>

              <button 
                onClick={() => handleFeatureClick('stress')}
                className="bg-card rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 text-left group"
                data-testid="feature-stress"
              >
                <div className="w-12 h-12 bg-accent/50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent/70 transition-colors">
                  <BarChart3 className="text-orange-600 text-xl" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-3">Pantau Stres</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Evaluasi tingkat stres Anda dengan kuesioner sederhana dan lihat perkembangan dari waktu ke waktu.
                </p>
                <span className="text-orange-600 text-sm font-medium group-hover:underline">
                  Mulai Evaluasi →
                </span>
              </button>

              <button 
                onClick={() => handleFeatureClick('professional')}
                className="bg-card rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 text-left group"
                data-testid="feature-professional"
              >
                <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-destructive/20 transition-colors">
                  <Users className="text-destructive text-xl" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-3">Bantuan Profesional</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Akses langsung ke kontak darurat dan rujukan profesional kesehatan mental terpercaya.
                </p>
                <span className="text-destructive text-sm font-medium group-hover:underline">
                  Lihat Kontak →
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Resources Section */}
        <section id="sumber-daya" className="py-20 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-semibold text-foreground mb-4">
                Sumber Daya Kesehatan Mental
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Informasi dan kontak bantuan profesional yang dapat Anda akses kapan saja membutuhkannya.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card rounded-xl p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-card-foreground mb-4 flex items-center">
                  <Phone className="mr-3 text-destructive" size={20} />
                  Hotline Darurat
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Crisis Helpline Indonesia</span>
                    <a href="tel:119" className="text-destructive font-medium hover:underline">119</a>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Yayasan Pulih</span>
                    <a href="tel:+62-21-788-42580" className="text-destructive font-medium hover:underline">021-788-42580</a>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-card-foreground mb-4 flex items-center">
                  <Users className="mr-3 text-primary" size={20} />
                  Organisasi Terpercaya
                </h3>
                <div className="space-y-3">
                  <a href="https://yayasanpulih.org" target="_blank" rel="noopener noreferrer" 
                     className="block text-muted-foreground hover:text-primary transition-colors">
                    Yayasan Pulih - Trauma healing
                  </a>
                  <a href="https://intothelightid.org" target="_blank" rel="noopener noreferrer"
                     className="block text-muted-foreground hover:text-primary transition-colors">
                    Into The Light ID - Pencegahan bunuh diri
                  </a>
                  <a href="https://himpsi.or.id" target="_blank" rel="noopener noreferrer"
                     className="block text-muted-foreground hover:text-primary transition-colors">
                    HIMPSI - Direktori psikolog berlisensi
                  </a>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <button 
                onClick={() => setIsResourcesOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                data-testid="button-view-all-resources"
              >
                Lihat Semua Sumber Daya
              </button>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="kontak" className="py-20 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-semibold text-foreground mb-6">
              Hubungi Kami
            </h2>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
              Tim kami siap membantu Anda 24/7. Jangan ragu untuk menghubungi kami jika membutuhkan bantuan segera.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-card rounded-xl p-8 shadow-sm">
                <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Phone className="text-destructive" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-3">Bantuan Darurat</h3>
                <p className="text-muted-foreground mb-4">
                  Jika Anda dalam krisis atau membutuhkan bantuan segera
                </p>
                <button 
                  onClick={() => setIsEmergencyOpen(true)}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-medium py-2 px-6 rounded-lg transition-colors"
                  data-testid="button-emergency-contact-section"
                >
                  Hubungi Sekarang
                </button>
              </div>

              <div className="bg-card rounded-xl p-8 shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-3">Chat Dukungan</h3>
                <p className="text-muted-foreground mb-4">
                  Berbicara dengan AI pendamping untuk dukungan emosional
                </p>
                <button 
                  onClick={handleStartChat}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-6 rounded-lg transition-colors"
                  data-testid="button-chat-contact-section"
                >
                  Mulai Chat
                </button>
              </div>
            </div>

            <div className="bg-accent/30 rounded-xl p-8">
              <h4 className="text-lg font-semibold text-card-foreground mb-4">
                Informasi Penting
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                Teras Cerita adalah platform dukungan kesehatan mental yang tidak menggantikan konsultasi medis profesional. 
                Jika Anda mengalami krisis atau pikiran untuk menyakiti diri sendiri, segera hubungi layanan darurat lokal atau 
                nomor hotline crisis: <a href="tel:119" className="text-destructive font-medium">119</a>
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 flex items-center justify-center">
                  <Leaf className="text-primary-foreground text-sm" size={16} />
                  <img src="/assets/images/logo_teras.png" alt="Logo Teras Cerita" className="h-full w-full object-contain" />
                </div>
                <h4 className="font-semibold text-foreground">Teras Cerita</h4>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Ruang digital yang aman untuk dukungan kesehatan mental dan ketenangan jiwa.
              </p>
            </div>

            <div>
              <h5 className="font-semibold text-foreground mb-4">Bantuan Cepat</h5>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  Crisis Helpline: <a href="tel:119" className="text-destructive font-medium">119</a>
                </p>
                <p className="text-muted-foreground">
                  WhatsApp Support: <a href="https://wa.me/6281234567890" className="text-primary font-medium">+62 812-3456-7890</a>
                </p>
              </div>
            </div>

            <div>
              <h5 className="font-semibold text-foreground mb-4">Penting untuk Diingat</h5>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Layanan ini tidak menggantikan konsultasi medis profesional. Jika Anda mengalami krisis, segera hubungi layanan darurat.
              </p>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-6 text-center">
            <p className="text-muted-foreground text-sm">
              © 2024 Teras Cerita. Dibuat dengan ❤️ untuk kesehatan mental Indonesia.
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ChatOverlay 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)}
        onEndSession={handleEndSession}
        sessionId={currentSessionId}
      />
      
      <EmergencyModal 
        isOpen={isEmergencyOpen} 
        onClose={() => setIsEmergencyOpen(false)}
        onSuccess={handleEmergencySuccess}
      />
      
      <StressAssessment 
        isOpen={isStressAssessmentOpen} 
        onClose={() => setIsStressAssessmentOpen(false)}
        onComplete={handleAssessmentComplete}
        sessionId={currentSessionId}
      />
      
      <StressResults 
        isOpen={isStressResultsOpen} 
        onClose={() => setIsStressResultsOpen(false)}
        onNewChat={handleNewChat}
        onShowResources={handleShowResources}
        results={stressResults}
      />
      
      <ProfessionalResources 
        isOpen={isResourcesOpen} 
        onClose={() => setIsResourcesOpen(false)}
        onBack={handleBackToResults}
      />
      
      <SuccessModal 
        isOpen={isSuccessOpen} 
        onClose={() => setIsSuccessOpen(false)}
      />
    </div>
  );
}
