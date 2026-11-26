import type {
  CostStatus,
  ScheduleStatus,
} from "../../domain/models/evm.model"


export interface ProjectRequestDto {
  name: string
  description?: string
}

export interface ActivityRequestDto {
  name: string
  plannedBudget: number
  plannedPercentage: number
  completedPercentage: number
  actualCost: number
}

export interface EvmMetricsResponseDto {
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

export interface ActivityResponseDto {
  id: string
  projectId: string
  name: string
  plannedBudget: number
  plannedPercentage: number
  completedPercentage: number
  actualCost: number
  metrics: EvmMetricsResponseDto
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ProjectResponseDto {
  id: string
  name: string
  description: string | null
  totalPlannedBudget: number
  totalActualCost: number
  activities: ActivityResponseDto[]
  consolidatedMetrics: EvmMetricsResponseDto
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ApiErrorResponseDto {
  status: number
  error: string
  message: string
  path: string
  timestamp: string
  validationErrors?: Record<string, string>
}
