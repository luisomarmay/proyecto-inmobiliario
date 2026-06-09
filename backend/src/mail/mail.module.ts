// ============================================================
// mail/mail.module.ts
// Registra MailService y lo exporta para que AuthModule
// pueda inyectarlo sin problemas.
// ============================================================

import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  providers: [MailService],
  exports: [MailService], // ← importante: sin esto AuthModule no puede usarlo
})
export class MailModule {}
