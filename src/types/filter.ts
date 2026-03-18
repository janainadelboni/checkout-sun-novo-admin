export interface SavedFilter {
  id: string
  name: string
  products: string[]
  period: string
}

export interface FilterSelection {
  products: string[]
  period: string
}
