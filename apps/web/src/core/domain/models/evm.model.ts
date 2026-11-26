export type CostStatus =
  | "UNDER_BUDGET"
  | "ON_BUDGET"
  | "OVER_BUDGET"
  | "NO_COST_DATA"

export type ScheduleStatus =
  | "AHEAD_OF_SCHEDULE"
  | "ON_SCHEDULE"
  | "BEHIND_SCHEDULE"
  | "NO_SCHEDULE_DATA"

export interface EvmMetrics {
  plannedValue: number
  earnedValue: number
  costVariance: number
  scheduleVariance: number
  cpi: number
  spi: number
  eac: number
  vac: number
  costStatus: CostStatus
  scheduleStatus: ScheduleStatus
}

export interface Activity {
  id: string
  projectId: string
  name: string
  plannedBudget: number
  plannedPercentage: number
  completedPercentage: number
  actualCost: number
  metrics: EvmMetrics
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  name: string
  description: string
  totalPlannedBudget: number
  totalActualCost: number
  activities: Activity[]
  consolidatedMetrics: EvmMetrics
  isActive: boolean
  createdAt: string
  updatedAt: string
}
