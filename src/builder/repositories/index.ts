/**
 * The PageRepository used by the builder and admin UI.
 * Backed by the admin HTTP API. Swap the implementation here without
 * touching any UI code.
 */
export { httpPageRepository as pageRepository } from "./http-repository";
export type { PageRepository } from "./page-repository";
