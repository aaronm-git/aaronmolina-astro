/**
 * Class name utility for conditionally joining class names
 * Inspired by clsx/tailwind-merge patterns
 */

type ClassValue = string | number | boolean | null | undefined | ClassValue[];
type ClassDictionary = Record<string, boolean | undefined | null>;

/**
 * Combines class names, filtering out falsy values
 * @example cn('base', condition && 'conditional', { active: isActive })
 */
export function cn(...inputs: (ClassValue | ClassDictionary)[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string' || typeof input === 'number') {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) classes.push(nested);
    } else if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key);
      }
    }
  }

  return classes.join(' ');
}

/**
 * Creates a variant-based class builder
 * @example
 * const buttonVariants = createVariants({
 *   base: 'btn',
 *   variants: {
 *     size: { sm: 'btn-sm', lg: 'btn-lg' },
 *     color: { primary: 'btn-primary', secondary: 'btn-secondary' }
 *   },
 *   defaults: { size: 'sm', color: 'primary' }
 * })
 */
export function createVariants<
  V extends Record<string, Record<string, string>>,
  D extends { [K in keyof V]?: keyof V[K] }
>(config: {
  base?: string;
  variants: V;
  defaults?: D;
}) {
  return function (props?: { [K in keyof V]?: keyof V[K] } & { class?: string }): string {
    const { base = '', variants, defaults = {} as D } = config;
    const classes: string[] = base ? [base] : [];

    for (const [variantKey, variantOptions] of Object.entries(variants)) {
      const selectedOption = props?.[variantKey as keyof V] ?? defaults[variantKey as keyof D];
      if (selectedOption && variantOptions[selectedOption as string]) {
        classes.push(variantOptions[selectedOption as string]);
      }
    }

    if (props?.class) {
      classes.push(props.class);
    }

    return classes.join(' ');
  };
}

export default cn;
