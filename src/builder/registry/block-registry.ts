/**
 * Public registry API (data only). Re-exports the unified definitions.
 * Components live in `block-components.tsx`.
 */
export {
  blockDefinitions as blockRegistry,
  blockDefinitions,
  getBlockDefinition,
  isKnownBlockType,
  canHaveChildren,
  categoryLabels,
  createBlockInstance,
  regenerateIds,
  newId,
  COMMON_FIELDS,
  type BlockTypeKey,
  type BlockInstance,
} from "./block-definitions";
