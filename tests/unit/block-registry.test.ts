import { describe, expect, it } from "vitest";
import {
  blockDefinitions,
  createBlockInstance,
  regenerateIds,
} from "@/builder/registry/block-definitions";
import { validateBlock } from "@/builder/validation/page-schema";
import type { FieldSchema } from "@/builder/schema-types";

function collectIds(v: unknown, out: string[] = []): string[] {
  if (Array.isArray(v)) v.forEach((x) => collectIds(x, out));
  else if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    if (typeof o.id === "string") out.push(o.id);
    Object.values(o).forEach((x) => collectIds(x, out));
  }
  return out;
}

function walkFields(fields: FieldSchema[], fn: (f: FieldSchema) => void) {
  for (const f of fields) {
    fn(f);
    if (f.itemFields) walkFields(f.itemFields, fn);
  }
}

describe("block registry", () => {
  it("has unique block types", () => {
    const types = blockDefinitions.map((d) => d.type);
    expect(new Set(types).size).toBe(types.length);
  });

  it.each(blockDefinitions.map((d) => [d.type, d] as const))(
    "%s: default instance is a valid, serializable block",
    (_type, def) => {
      const inst = createBlockInstance(def.type);
      expect(validateBlock(inst).ok).toBe(true);
      expect(JSON.parse(JSON.stringify(inst))).toEqual(inst);
      expect(def.nameFa.trim()).not.toBe("");
    }
  );

  it.each(blockDefinitions.map((d) => [d.type, d] as const))(
    "%s: schema fields are well formed",
    (_type, def) => {
      walkFields(def.schema, (f) => {
        expect(f.path).toBeTruthy();
        if (f.type === "select") expect(f.options?.length).toBeGreaterThan(0);
        if (f.type === "array") expect(f.itemFields?.length).toBeGreaterThan(0);
      });
    }
  );

  it("gives every instance (and nested item) a fresh id", () => {
    const a = createBlockInstance("footer");
    const b = createBlockInstance("footer");
    const ids = [...collectIds(a), ...collectIds(b)];
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("regenerateIds does not mutate its input", () => {
    const src = { id: "x", items: [{ id: "y" }] };
    const copy = regenerateIds(src);
    expect(src).toEqual({ id: "x", items: [{ id: "y" }] });
    expect(copy.id).not.toBe("x");
    expect(copy.items[0].id).not.toBe("y");
  });
});
