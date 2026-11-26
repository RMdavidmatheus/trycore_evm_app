import type {
  Activity,
  EvmMetrics,
  Project,
} from "../../domain/models/evm.model"
import type {
  ActivityResponseDto,
  EvmMetricsResponseDto,
  ProjectResponseDto,
} from "../dtos/evm.dto"

export const mapEvmMetricsDtoToDomain = (
  dto: EvmMetricsResponseDto
): EvmMetrics => ({
  plannedValue: Number(dto.plannedValue ?? 0),
  earnedValue: Number(dto.earnedValue ?? 0),
  costVariance: Number(dto.costVariance ?? 0),
  scheduleVariance: Number(dto.scheduleVariance ?? 0),
  cpi: Number(dto.cpi ?? 0),
  spi: Number(dto.spi ?? 0),
  eac: Number(dto.eac ?? 0),
  vac: Number(dto.vac ?? 0),
  costStatus: dto.costStatus,
  scheduleStatus: dto.scheduleStatus,
})

export const mapActivityDtoToDomain = (dto: ActivityResponseDto): Activity => ({
  id: dto.id,
  projectId: dto.projectId,
  name: dto.name,
  plannedBudget: Number(dto.plannedBudget ?? 0),
  plannedPercentage: Number(dto.plannedPercentage ?? 0),
  completedPercentage: Number(dto.completedPercentage ?? 0),
  actualCost: Number(dto.actualCost ?? 0),
  metrics: mapEvmMetricsDtoToDomain(dto.metrics),
  isActive: Boolean(dto.isActive),
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
})

export const mapProjectDtoToDomain = (dto: ProjectResponseDto): Project => ({
  id: dto.id,
  name: dto.name,
  description: dto.description ?? "",
  totalPlannedBudget: Number(dto.totalPlannedBudget ?? 0),
  totalActualCost: Number(dto.totalActualCost ?? 0),
  activities: Array.isArray(dto.activities)
    ? dto.activities.map(mapActivityDtoToDomain)
    : [],
  consolidatedMetrics: mapEvmMetricsDtoToDomain(dto.consolidatedMetrics),
  isActive: Boolean(dto.isActive),
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
})
