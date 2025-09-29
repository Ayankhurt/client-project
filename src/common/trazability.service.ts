import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TrazabilityService {
  private readonly logger = new Logger(TrazabilityService.name);

  async sendEvent(payload: any) {
    try {
      await axios.post(`${process.env.TRAZ_BASE_URL}/events`, payload, {
        headers: { Authorization: `Bearer ${process.env.TRAZ_TOKEN}` },
        timeout: 5000,
      });
    } catch (err) {
      this.logger.warn(`Failed to send trazability event: ${err.message}`);
    }
  }
}