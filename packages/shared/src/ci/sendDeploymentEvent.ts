import crypto from 'node:crypto';
import process from 'node:process';
import axios from 'axios';

export interface DeploymentEvent {
  repo: string;
  commit: string;
  image: string;
  environment: string;
  serviceName: string;
  labels?: Record<string, string>;
  timestamp?: string;
}

export async function sendDeploymentEvent(event: DeploymentEvent, options?: { secret?: string; url?: string }): Promise<void> {
  const secret = options?.secret ?? process.env.HMAC_SECRET;
  const url = options?.url ?? process.env.API_URL;

  if (!secret) {
    throw new Error('Missing HMAC secret');
  }

  if (!url) {
    throw new Error('Missing API URL');
  }

  const payload = JSON.stringify({ ...event, timestamp: event.timestamp ?? new Date().toISOString() });
  const timestamp = new Date().toISOString();
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');

  await axios.post(`${url}/v1/ingest/ci-event`, payload, {
    headers: {
      'Content-Type': 'application/json',
      'X-Signature': `sha256=${signature}`,
      'X-Timestamp': timestamp,
    },
  });
}
