import { setCookie, setHeader, type H3Event } from "h3";
import type { CookieOptions } from "#app";

export function setCookies(
  event: H3Event,
  cookies: {
    name: string;
    value: string;
    options: CookieOptions;
  }[],
  headers: Record<string, string> = {},
) {
  const response = event.node.res;
  const headersWritable = () =>
    !response.headersSent && !response.writableEnded;

  if (!headersWritable()) {
    return;
  }

  for (const { name, value, options } of cookies) {
    if (!headersWritable()) {
      break;
    }
    setCookie(event, name, value, options);
  }

  // Apply cache control headers to prevent CDN caching of auth responses
  for (const [key, value] of Object.entries(headers)) {
    if (!headersWritable()) {
      break;
    }
    setHeader(event, key, value);
  }
}
