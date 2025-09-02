import { X, Phone, Building2, ArrowLeft } from "lucide-react";

interface ProfessionalResourcesProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
}

const emergencyContacts = [
  { name: "Crisis Helpline Indonesia", number: "119", href: "tel:119" },
  { name: "Yayasan Pulih", number: "021-788-42580", href: "tel:+62-21-788-42580" }
];

const professionals = [
  {
    name: "Dr. Sarah Wijaya, M.Psi",
    specialty: "Spesialis Kecemasan & Depresi",
    location: "📍 Jakarta Selatan",
    phone: "021-12345678",
    href: "tel:+62-21-12345678",
    availability: "Online & Offline"
  },
  {
    name: "Ahmad Rahman, M.Psi",
    specialty: "Konselor Keluarga & Trauma",
    location: "📍 Bandung",
    phone: "022-87654321",
    href: "tel:+62-22-87654321",
    availability: "Konsultasi Online"
  },
  {
    name: "Dr. Maya Sari, Sp.KJ",
    specialty: "Psikiater & Terapi Kognitif",
    location: "📍 Surabaya",
    phone: "031-11223344",
    href: "tel:+62-31-11223344",
    availability: "Klinik & Telehealth"
  }
];

const organizations = [
  {
    name: "Yayasan Pulih",
    description: "Trauma healing dan dukungan psikososial",
    website: "https://yayasanpulih.org"
  },
  {
    name: "Into The Light Indonesia",
    description: "Pencegahan bunuh diri dan krisis mental",
    website: "https://intothelightid.org"
  },
  {
    name: "Himpunan Psikologi Indonesia",
    description: "Direktori psikolog berlisensi",
    website: "https://himpsi.or.id"
  }
];

export default function ProfessionalResources({ isOpen, onClose, onBack }: ProfessionalResourcesProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-card-foreground">Sumber Daya Bantuan Profesional</h3>
            <button 
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="button-close-resources"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Emergency Hotlines */}
          <div className="bg-destructive/5 rounded-lg p-6 border border-destructive/20">
            <h4 className="font-semibold text-destructive mb-4 flex items-center">
              <Phone className="mr-2" size={16} />
              Hotline Darurat
            </h4>
            <div className="space-y-3">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-card-foreground">{contact.name}</span>
                  <a 
                    href={contact.href} 
                    className="text-destructive font-medium hover:underline"
                    data-testid={`link-emergency-${index}`}
                  >
                    {contact.number}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Professional Contacts */}
          <div className="space-y-4">
            <h4 className="font-semibold text-card-foreground flex items-center">
              <Building2 className="mr-2 text-primary" size={16} />
              Psikolog & Konselor Terverifikasi
            </h4>
            
            {professionals.map((professional, index) => (
              <div 
                key={index} 
                className="bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-colors"
                data-testid={`card-professional-${index}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium text-card-foreground">{professional.name}</h5>
                    <p className="text-muted-foreground text-sm">{professional.specialty}</p>
                    <p className="text-muted-foreground text-sm">{professional.location}</p>
                  </div>
                  <div className="text-right">
                    <a 
                      href={professional.href} 
                      className="text-primary font-medium hover:underline text-sm"
                      data-testid={`link-professional-${index}`}
                    >
                      {professional.phone}
                    </a>
                    <p className="text-muted-foreground text-xs">{professional.availability}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trusted Organizations */}
          <div className="space-y-4">
            <h4 className="font-semibold text-card-foreground flex items-center">
              <Building2 className="mr-2 text-accent-foreground" size={16} />
              Organisasi Kesehatan Mental Terpercaya
            </h4>
            
            <div className="grid gap-3">
              {organizations.map((org, index) => (
                <a 
                  key={index}
                  href={org.website} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-colors block"
                  data-testid={`link-organization-${index}`}
                >
                  <h5 className="font-medium text-card-foreground">{org.name}</h5>
                  <p className="text-muted-foreground text-sm">{org.description}</p>
                </a>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button 
              onClick={onBack}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-6 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
              data-testid="button-back-results"
            >
              <ArrowLeft size={16} />
              <span>Kembali ke Hasil</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
