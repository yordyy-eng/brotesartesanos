function walk(node: unknown, parts: string[]) {
  if (!node || typeof node !== 'object') return
  const { text, children } = node as { text?: unknown; children?: unknown }
  if (typeof text === 'string') parts.push(text)
  if (Array.isArray(children)) children.forEach((child) => walk(child, parts))
}

export function richTextToPlainText(richText: unknown): string {
  if (!richText || typeof richText !== 'object' || !('root' in richText)) return ''

  const parts: string[] = []
  walk((richText as { root: unknown }).root, parts)
  return parts.join(' ').replace(/\s+/g, ' ').trim()
}
