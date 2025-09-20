# API Reference

The API exposes REST endpoints under `/v1`. Interactive Swagger UI is available at `/docs` when running locally. The OpenAPI specification is generated at build time and published to [`apps/api/openapi.json`](../apps/api/openapi.json).

The typed SDK consumed by the frontend lives in `packages/shared` and is generated from the OpenAPI contract using `openapi-typescript`.

## Authentication

All requests require a valid OIDC bearer token. Local development uses the mock OIDC provider with static users defined under `apps/api/src/auth/mockUsers.ts`.

## Pagination & Filtering

Endpoints support cursor-based pagination via the `page[size]` and `page[after]` parameters. Filter parameters follow the JSON:API-style `filter[<field>]=<value>` syntax.

## Error Handling

Errors are returned using the `application/problem+json` media type with the following shape:

```json
{
  "type": "https://docs.example.com/problems/validation-error",
  "title": "Validation Failed",
  "status": 400,
  "detail": "Component type must be BACKEND|FRONTEND|DATA",
  "instance": "/v1/components/123"
}
```

## Versioning

Breaking changes bump the `v` prefix. Deprecated fields include a `deprecated: true` flag in the schema and emit warnings via the `Sunset` response header.
