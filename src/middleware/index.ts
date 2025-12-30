import { defineMiddleware } from "astro:middleware";

/**
 * Generate a random nonce for CSP
 */
function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
}

/**
 * Build CSP header with strict-dynamic and nonce
 */
function buildCSPHeader(nonce: string): string {
  const directives = [
    "default-src 'none'",
    `script-src 'nonce-${nonce}' 'strict-dynamic' https: 'unsafe-inline'`,
    `style-src 'nonce-${nonce}' 'self'`,
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "media-src 'self'",
    "worker-src 'self'",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "manifest-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ];

  return directives.join("; ");
}

export const onRequest = defineMiddleware(async (context, next) => {
  // Redirect www to non-www (canonical domain)
  const url = new URL(context.request.url);
  if (url.hostname === "www.phwu.dev") {
    return Response.redirect(
      `https://phwu.dev${url.pathname}${url.search}`,
      301,
    );
  }

  // Generate a unique nonce for this request
  const nonce = generateNonce();

  // Store nonce in locals so it's available in components
  context.locals.cspNonce = nonce;

  // Continue to the response
  const response = await next();

  // Add CSP header to the response
  response.headers.set("Content-Security-Policy", buildCSPHeader(nonce));

  // Add other security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=()",
  );

  return response;
});
