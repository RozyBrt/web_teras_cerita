import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  console.warn("SENDGRID_API_KEY environment variable not set - emergency emails will not be sent");
}

interface EmailParams {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

interface EmergencyContactData {
  name?: string;
  contact: string;
  message?: string;
}

export async function sendEmergencyNotification(emergencyData: EmergencyContactData): Promise<boolean> {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.error('SendGrid API key not configured');
      return false;
    }

    const mailService = new MailService();
    mailService.setApiKey(process.env.SENDGRID_API_KEY);
    
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@ruangtenang.com';
    const fromEmail = process.env.FROM_EMAIL || 'noreply@ruangtenang.com';
    
    const html = `
      <h2 style="color: #dc2626;">🚨 PERMINTAAN BANTUAN SEGERA - Ruang Tenang</h2>
      <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626;">
        <h3>Detail Permintaan:</h3>
        <p><strong>Nama:</strong> ${emergencyData.name || 'Tidak disebutkan'}</p>
        <p><strong>Kontak:</strong> ${emergencyData.contact}</p>
        <p><strong>Pesan:</strong> ${emergencyData.message || 'Tidak ada pesan tambahan'}</p>
        <p><strong>Waktu:</strong> ${new Date().toLocaleString('id-ID')}</p>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #fee2e2; border-radius: 6px;">
          <p style="margin: 0; color: #991b1b; font-weight: bold;">
            ⚠️ Ini adalah permintaan bantuan prioritas tinggi. Mohon segera menghubungi individu ini.
          </p>
        </div>
      </div>
    `;

    await mailService.send({
      to: adminEmail,
      from: fromEmail,
      subject: '🚨 PERMINTAAN BANTUAN SEGERA - Ruang Tenang',
      html,
      text: `PERMINTAAN BANTUAN SEGERA\n\nNama: ${emergencyData.name || 'Tidak disebutkan'}\nKontak: ${emergencyData.contact}\nPesan: ${emergencyData.message || 'Tidak ada pesan tambahan'}\nWaktu: ${new Date().toLocaleString('id-ID')}\n\nMohon segera menghubungi individu ini.`
    });

    return true;
  } catch (error) {
    console.error('Failed to send emergency notification:', error);
    return false;
  }
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.error('SendGrid API key not configured');
      return false;
    }

    const mailService = new MailService();
    mailService.setApiKey(process.env.SENDGRID_API_KEY);
    
    await mailService.send({
      to: params.to,
      from: process.env.FROM_EMAIL || 'noreply@ruangtenang.com',
      subject: params.subject,
      text: params.text || '',
      html: params.html || '',
    });
    
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}
