export type Institution = {
  id: string
  name: string
  display_name: string
}

export type Account = {
  id: string
  name: string
  type: string
  institution: string
}

export type BankLink = {
  id: string
  institution: string
}

export type Transaction = {
  id: string
  description: string | null
  type: "INFLOW" | "OUTFLOW"
  status: string
  amount: number
  currency: string
  value_date: string
  category: string | null
}
