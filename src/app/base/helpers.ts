export function hasTitle(item: any): item is { title: string } {
  return item != null && typeof item === 'object' && 'title' in item;
}

export function toTitleCase(str: string | null | undefined) {
  if (str) {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  } else {
    return '';
  }
}
