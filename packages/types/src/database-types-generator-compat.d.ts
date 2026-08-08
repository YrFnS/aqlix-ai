// Compatibility bridge for the generated Supabase helper generic. The
// repository has one exposed database schema (`public`), so this ambient name
// preserves the intended constraint until the next full CLI regeneration.
declare global {
  type DefaultSchemaCompositeTypeNameOrOptions = {
    schema: "public";
  };
}

export {};
