# Operations Runbooks

## On-call Checklist

1. Check alerts in PagerDuty and confirm acknowledgement.
2. Review logs via the aggregated Loki dashboard and filter by `trace_id` from the alert.
3. Validate `/healthz` and `/readyz` endpoints for api and web pods.
4. Capture timeline in the incident doc template.

## Backup & Restore

- PostgreSQL: nightly logical backups via `pg_dump` stored in encrypted S3 bucket with 14-day retention.
- Redis: snapshot disabled (cache tier). Persistent data stored in Postgres.
- Restore: deploy new Postgres instance, run `psql -f backup.sql`, rotate credentials.

## Secret Rotation

1. Update secret in the secret manager (AWS Secrets Manager / Azure Key Vault / GCP Secret Manager).
2. Trigger the `deploy.yml` workflow with `rotation=true` input to restart pods.
3. Validate successful rotation via `/metrics` gauge `secret_rotation_success`.

## Incident SEV Matrix

| Severity | Description | Target Response |
|----------|-------------|-----------------|
| SEV1 | Production outage or security breach | 15 minutes |
| SEV2 | Degraded functionality impacting many tenants | 1 hour |
| SEV3 | Minor incident or single tenant issue | 4 hours |
| SEV4 | Informational | 1 business day |
