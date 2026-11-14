/**
 * The PageRepository used by the builder and admin UI.
 * Swap the implementation here (e.g. LocalStorage → HTTP API) without
 * touching any UI code.
 */
export { pageRepository } from "./local-storage-repository";
export type { PageRepository } from "./page-repository";
