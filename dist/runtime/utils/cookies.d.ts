import { type H3Event } from 'h3';
import type { CookieOptions } from '#app';
export declare function setCookies(event: H3Event, cookies: {
    name: string;
    value: string;
    options: CookieOptions;
}[]): void;
