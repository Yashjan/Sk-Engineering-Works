export type TranslationDictionary = Readonly<Record<string, string>>;

export function preserveWhitespace(source: string, translated: string) {
  const leading = source.match(/^\s*/)?.[0] ?? "";
  const trailing = source.match(/\s*$/)?.[0] ?? "";
  return `${leading}${translated}${trailing}`;
}

export function createTranslator(dictionary: TranslationDictionary) {
  const lower = new Map(Object.entries(dictionary).map(([source, translated]) => [source.toLocaleLowerCase("en"), translated]));
  return (value: string) => {
    const normalized = value.replace(/\s+/g, " ").trim();
    if (!normalized) return value;
    const translated = dictionary[normalized] ?? lower.get(normalized.toLocaleLowerCase("en"));
    return translated ? preserveWhitespace(value, translated) : value;
  };
}
