# Security Policy

## Supported Versions

Only the latest released version of **breeze-chms** receives security fixes.

| Version | Supported |
| ------- | --------- |
| latest  | ✅        |
| older   | ❌        |

## Reporting a Vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Instead, use one of the following channels:

- **GitHub private vulnerability reporting** — click _"Report a vulnerability"_ under the
  [Security tab](../../security/advisories/new) of this repository.
- **Email** — send details to <support@notebird.dev> with the subject line
  `[breeze-chms] Security Vulnerability`.

We aim to acknowledge reports within **48 hours** and will keep you updated on our progress.
Fixes are typically released within **7–14 days** for high/critical severity issues.

## Scope

This package is a thin HTTP client wrapper around the
[Breeze ChMS REST API](https://app.breezechms.com/api). Relevant areas include:

- Input validation of `subdomain` and API `key` constructor arguments.
- Handling of HTTP responses and error propagation.
- Dependency vulnerabilities in `package.json`.

## Security Design Notes

- **No third-party HTTP library** — network requests use the platform-native `fetch` API,
  eliminating supply-chain risk from libraries such as `axios`.
- **URL construction** — the API base URL is validated at object construction time using
  the WHATWG `URL` API; only alphanumeric subdomains are accepted.
- **API key** — transmitted exclusively via the `Api-Key` request header (never in URLs
  or query strings).
