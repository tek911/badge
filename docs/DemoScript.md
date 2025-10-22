# Demo Script

1. **Login**: Use the seeded demo credentials (`demo.admin@example.com` / `password`) to authenticate via the OIDC mock provider.
2. **Dashboard**: Highlight KPIs: total applications, unmapped workloads, coverage score.
3. **Applications List**: Filter by `Cloud: AWS` and show how tags and owners appear.
4. **Application Detail**: Open `Payments Platform` and walk through the front-end, back-end, and data components. Show repository links, dependencies, container images, workloads, and confidence scores.
5. **Workloads Explorer**: Navigate to GKE cluster and confirm the `checkout-web` deployment is mapped with 0.96 confidence.
6. **Integrations**: Demonstrate adding a GitHub connector using mock credentials and running a dry-run sync.
7. **Audit Trail**: Approve a suggested repo→workload link and show the audit log entry.
8. **CI Event**: Use the provided CLI (`pnpm --filter shared ci:send -- --demo`) to emit a deployment event and refresh the timeline.
9. **Wrap Up**: Emphasise security controls, observability dashboards, and extensible connector model.
