# CI Deployment Event Contract

Deployment events allow CI pipelines to notify the platform of new workloads. Payloads must be signed using the shared HMAC secret and sent to `POST /v1/ingest/ci-event`.

```json
{
  "repo": "acme/payments-api",
  "commit": "a1b2c3d4",
  "image": "registry.acme.io/payments@sha256:deadbeef",
  "environment": "prod",
  "serviceName": "payments-api",
  "labels": {
    "app": "payments",
    "owner": "team-alpha"
  },
  "timestamp": "2024-02-11T16:00:00Z"
}
```

HTTP headers:

- `X-Signature`: `sha256=<hex>`
- `X-Timestamp`: ISO 8601 timestamp used for replay protection (5 minute window)

## GitHub Actions Snippet

```yaml
jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Emit deployment event
        env:
          HMAC_SECRET: ${{ secrets.CI_EVENT_SECRET }}
          API_URL: https://inventory.example.com
        run: |
          node scripts/send-ci-event.mjs \
            --repo "acme/payments-api" \
            --environment prod \
            --service-name payments-api \
            --image "${{ env.IMAGE_DIGEST }}" \
            --commit "${{ github.sha }}"
```

## GitLab CI Snippet

```yaml
notify:
  image: node:20-alpine
  script:
    - node scripts/send-ci-event.mjs --repo "$CI_PROJECT_PATH" --commit "$CI_COMMIT_SHA" --image "$IMAGE_DIGEST" --environment "$CI_ENVIRONMENT_NAME" --service-name payments-api
  only:
    - main
```

Both snippets rely on the shared CLI utility provided in `packages/shared/src/ci/sendDeploymentEvent.ts` which handles signing and retries.
