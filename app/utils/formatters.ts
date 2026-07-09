export const formatCurrency = (amount: number, currency = 'GBP'): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
  }).format(amount)
}

export const formatDate = (date: string, options?: Intl.DateTimeFormatOptions): string => {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    ...options,
  }).format(new Date(date))
}

export const formatDateTime = (date: string): string => {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

export const formatWeight = (weight: number, unit: 'g' | 'kg'): string => {
  if (unit === 'g' && weight >= 1000) {
    return `${(weight / 1000).toFixed(1)}kg`
  }
  return `${weight}${unit}`
}

// Suffix shown after a price for weight-sold products, e.g. " / kg".
// Non-weight units (e.g. "each") get no suffix.
export const unitPriceSuffix = (unit?: string, soldByWeight?: boolean): string => {
  if (!soldByWeight || !unit || unit === 'each') return ''
  return ` / ${unit}`
}

// Full price + unit, e.g. "£12.00 / kg" or "£7.49".
export const formatUnitPrice = (
  amount: number,
  unit?: string,
  soldByWeight?: boolean
): string => `${formatCurrency(amount)}${unitPriceSuffix(unit, soldByWeight)}`

// Quantity with its unit for weight products, e.g. "2.5 kg"; plain number otherwise.
export const formatQuantity = (
  quantity: number,
  unit?: string,
  soldByWeight?: boolean
): string => {
  if (soldByWeight && unit && unit !== 'each') return `${quantity} ${unit}`
  return `${quantity}`
}

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const truncate = (text: string, length: number): string => {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + '...'
}

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('44')) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 6)} ${cleaned.slice(6)}`
  }
  if (cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`
  }
  return phone
}
