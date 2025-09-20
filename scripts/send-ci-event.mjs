#!/usr/bin/env node
import crypto from 'node:crypto';
import https from 'node:https';
import http from 'node:http';
import { Command } from 'commander';

const program = new Command();
program
  .requiredOption('--repo <repo>')
  .requiredOption('--commit <sha>')
  .requiredOption('--image <image>')
  .requiredOption('--environment <env>')
  .requiredOption('--service-name <name>')
  .option('--label <label...>', 'Key=value pairs');

program.parse(process.argv);

const options = program.opts();
const labels = Object.fromEntries((options.label ?? []).map((entry) => entry.split('=')));

const payload = JSON.stringify({
  repo: options.repo,
  commit: options.commit,
  image: options.image,
  environment: options.environment,
  serviceName: options.serviceName,
  labels,
  timestamp: new Date().toISOString(),
});

const secret = process.env.HMAC_SECRET;
const apiUrl = process.env.API_URL;

if (!secret || !apiUrl) {
  throw new Error('HMAC_SECRET and API_URL must be provided');
}

const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
const url = new URL('/v1/ingest/ci-event', apiUrl);
const client = url.protocol === 'https:' ? https : http;

const req = client.request(
  url,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Signature': `sha256=${signature}`,
      'X-Timestamp': new Date().toISOString(),
      'Content-Length': Buffer.byteLength(payload),
    },
  },
  (res) => {
    res.on('data', () => undefined);
    res.on('end', () => {
      console.log(`Deployment event sent: ${res.statusCode}`);
    });
  },
);

req.on('error', (error) => {
  console.error('Failed to send deployment event', error);
  process.exitCode = 1;
});

req.write(payload);
req.end();
