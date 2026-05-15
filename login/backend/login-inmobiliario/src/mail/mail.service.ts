// ============================================================
// mail/mail.service.ts
// Servicio dedicado al envío de emails con Nodemailer.
// Solo hace UNA cosa: enviar emails. La lógica de negocio
// (generar tokens, etc.) queda en AuthService.
// ============================================================

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  // Logger de NestJS para ver en consola si el email se envió
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    // Configura la conexión con Gmail usando las credenciales del .env
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: configService.get<string>('MAIL_USER'),
        pass: configService.get<string>('MAIL_PASS'),
      },
    });
  }

  // Envía el email de recuperación de contraseña
  async sendPasswordReset(email: string, token: string): Promise<void> {
    const frontendUrl = this.configService.get('FRONTEND_URL');
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    await this.transporter.sendMail({
      from: this.configService.get('MAIL_FROM'),
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
}
