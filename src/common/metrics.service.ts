import { Injectable } from '@nestjs/common';
import { Counter, Registry } from 'prom-client';

@Injectable()
export class MetricsService {
  public readonly cfValidationErrors: Counter<string>;
  public readonly registry: Registry;

  constructor() {
    this.registry = new Registry();
    this.cfValidationErrors = new Counter({
      name: 'cf_validation_errors_total',
      help: 'Number of validation errors in custom fields service',
      registers: [this.registry],
    });
  }

  incValidationError() {
    this.cfValidationErrors.inc();
  }
}
