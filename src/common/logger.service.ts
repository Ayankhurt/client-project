// common/logger.service.ts
import { Injectable, Logger } from '@nestjs/common';
import * as promClient from 'prom-client';

@Injectable()
export class LoggerService extends Logger {
  public validationErrors = new promClient.Counter({
    name: 'cf_validation_errors_total',
    help: 'Total number of validation errors in custom fields',
  });

  logValidationError(message: string) {
    this.validationErrors.inc();
    this.error(message);
  }
}
