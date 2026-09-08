export interface AdminSubscriptionPlan {
  id: number
  name: string
  duration_months: number
  price: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SubscriptionPlanFormValues {
  name: string
  duration_months: string
  price: string
  is_active: boolean
}
