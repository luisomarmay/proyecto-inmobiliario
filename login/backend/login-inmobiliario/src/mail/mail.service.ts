import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private resend: Resend;

  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(configService.get<string>('RESEND_API_KEY'));
  }

  async sendPasswordReset(email: string, token: string): Promise<void> {
    const frontendUrl = this.configService.get('FRONTEND_URL');
    const resetUrl = `${frontendUrl}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    await this.resend.emails.send({
      from: 'Sistema Inmobiliario <onboarding@resend.dev>',
      to: email,
      subject: 'Recupera tu contraseña — Sistema Inmobiliario',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;">
          <div style="width:10px;height:10px;border-radius:50%;background:#FCA311;margin-bottom:24px;"></div>
          <h2 style="color:#14213D;margin-bottom:8px;">Recupera tu contraseña</h2>
          <p style="color:#6b7280;font-size:14px;line-height:1.6;">
            Recibimos una solicitud para restablecer la contraseña de tu cuenta.
            Haz clic en el botón de abajo para continuar.
          </p>
          <a href="${resetUrl}"
            style="display:inline-block;margin-top:24px;padding:12px 28px;
                   background:#14213D;color:#F8F9FA;border-radius:8px;
                   text-decoration:none;font-size:14px;font-weight:500;">
            Restablecer contraseña
          </a>
          <p style="color:#9ca3af;font-size:12px;margin-top:24px;">
            Este enlace expira en <strong>1 hora</strong>.<br/>
            Si no solicitaste esto, ignora este correo.
          </p>
        </div>
      `,
    });

    this.logger.log(`Email de recuperación enviado a ${email}`);
  }

  async sendWelcome(email: string, name: string): Promise<void> {
    const frontendUrl = this.configService.get('FRONTEND_URL');

    await this.resend.emails.send({
      from: 'Sistema Inmobiliario <onboarding@resend.dev>',
      to: email,
      subject: '¡Bienvenido al Sistema Inmobiliario!',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;">
          <div style="width:10px;height:10px;border-radius:50%;background:#FCA311;margin-bottom:24px;"></div>
          <h2 style="color:#14213D;margin-bottom:8px;">¡Bienvenido, ${name}!</h2>
          <p style="color:#6b7280;font-size:14px;line-height:1.6;">
            Tu cuenta en <strong>Sistema Inmobiliario</strong> ha sido creada exitosamente.
            Ya puedes explorar propiedades, gestionar tus rentas y mucho más.
          </p>
          <a href="${frontendUrl}/login"
            style="display:inline-block;margin-top:24px;padding:12px 28px;
                   background:#14213D;color:#F8F9FA;border-radius:8px;
                   text-decoration:none;font-size:14px;font-weight:500;">
            Ir al sistema
          </a>
          <p style="color:#9ca3af;font-size:12px;margin-top:24px;">
            Si no creaste esta cuenta, ignora este correo.
          </p>
        </div>
      `,
    });

    this.logger.log(`Email de bienvenida enviado a ${email}`);
  }
}
