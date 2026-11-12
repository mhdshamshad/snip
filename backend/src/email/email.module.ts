import { Global, Module } from '@nestjs/common';
import { EMAIL_SERVICE } from './email.interface';
import { NodemailerEmailService } from './email.service';

@Global()
@Module({
  providers: [
    {
      provide: EMAIL_SERVICE,
      useClass: NodemailerEmailService,
    },
    NodemailerEmailService,
  ],
  exports: [EMAIL_SERVICE, NodemailerEmailService],
})
export class EmailModule {}
