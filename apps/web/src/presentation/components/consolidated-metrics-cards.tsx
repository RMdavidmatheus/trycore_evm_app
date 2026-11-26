"use client"

import {
  ActivityIcon,
  CalendarClockIcon,
  CoinsIcon,
  GaugeIcon,
  ScaleIcon,
  TargetIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Progress } from "@workspace/ui/components/progress"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"
import type { Project } from "../../core/domain/models/evm.model"
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
  getCostStatusInfo,
  getScheduleStatusInfo,
} from "../../lib/formatters"

interface ConsolidatedMetricsCardsProps {
  project: Project
}

export function ConsolidatedMetricsCards({
  project,
}: ConsolidatedMetricsCardsProps) {
  const { consolidatedMetrics, totalPlannedBudget, totalActualCost } = project
  const costInfo = getCostStatusInfo(consolidatedMetrics.costStatus)
  const scheduleInfo = getScheduleStatusInfo(consolidatedMetrics.scheduleStatus)

  // Porcentajes consolidados del proyecto para barras de progreso visuales
  const earnedPct =
    totalPlannedBudget > 0
      ? Math.min(
        100,
        (consolidatedMetrics.earnedValue / totalPlannedBudget) * 100
      )
      : 0
  const plannedPct =
    totalPlannedBudget > 0
      ? Math.min(
        100,
        (consolidatedMetrics.plannedValue / totalPlannedBudget) * 100
      )
      : 0
  const budgetBurnPct =
    totalPlannedBudget > 0
      ? Math.min(100, (totalActualCost / totalPlannedBudget) * 100)
      : 0

  return (
    <TooltipProvider>
      <div className="grid gap-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="relative overflow-hidden border-l-4 border-l-emerald-500 py-5">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex size-8 items-center justify-center rounded-lg">
                    <CoinsIcon className="size-4" />
                  </div>
                  <div>
                    <CardDescription className="text-xs font-medium">
                      Desempeño de Costos (CPI = EV / AC)
                    </CardDescription>
                    <CardTitle className="mt-0.5 text-2xl font-bold tracking-tight font-mono">
                      {formatNumber(consolidatedMetrics.cpi)}
                    </CardTitle>
                  </div>
                </div>
                <Badge variant={costInfo.variant} className="px-2.5 py-1">
                  {consolidatedMetrics.cpi >= 1 ? (
                    <TrendingUpIcon className="size-3.5" />
                  ) : (
                    <TrendingDownIcon className="size-3.5" />
                  )}
                  {costInfo.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 pt-1">
              <p className="text-muted-foreground text-xs">
                {costInfo.description}
              </p>

              <div className="grid gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Ejecución presupuestal (AC vs BAC)
                  </span>
                  <span className="font-mono font-medium">
                    {formatPercentage(budgetBurnPct)}
                  </span>
                </div>
                <Progress value={budgetBurnPct} />
              </div>

              <div className="bg-muted/50 flex items-center justify-between rounded-lg px-3 py-2 text-xs">
                <span className="text-muted-foreground">
                  Variación de Costos (CV = EV − AC)
                </span>
                <span
                  className={`font-mono font-semibold ${consolidatedMetrics.costVariance >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                    }`}
                >
                  {formatCurrency(consolidatedMetrics.costVariance)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-l-4 border-l-blue-500 py-5">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-500/10 text-blue-600 dark:text-blue-400 flex size-8 items-center justify-center rounded-lg">
                    <CalendarClockIcon className="size-4" />
                  </div>
                  <div>
                    <CardDescription className="text-xs font-medium">
                      Desempeño de Cronograma (SPI = EV / PV)
                    </CardDescription>
                    <CardTitle className="mt-0.5 text-2xl font-bold tracking-tight font-mono">
                      {formatNumber(consolidatedMetrics.spi)}
                    </CardTitle>
                  </div>
                </div>
                <Badge variant={scheduleInfo.variant} className="px-2.5 py-1">
                  {consolidatedMetrics.spi >= 1 ? (
                    <TrendingUpIcon className="size-3.5" />
                  ) : (
                    <TrendingDownIcon className="size-3.5" />
                  )}
                  {scheduleInfo.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 pt-1">
              <p className="text-muted-foreground text-xs">
                {scheduleInfo.description}
              </p>

              <div className="grid gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Avance físico ganado vs Planificado ({formatPercentage(plannedPct)})
                  </span>
                  <span className="font-mono font-medium">
                    {formatPercentage(earnedPct)}
                  </span>
                </div>
                <Progress value={earnedPct} />
              </div>

              <div className="bg-muted/50 flex items-center justify-between rounded-lg px-3 py-2 text-xs">
                <span className="text-muted-foreground">
                  Variación de Cronograma (SV = EV − PV)
                </span>
                <span
                  className={`font-mono font-semibold ${consolidatedMetrics.scheduleVariance >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                    }`}
                >
                  {formatCurrency(consolidatedMetrics.scheduleVariance)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <Tooltip>
            <TooltipTrigger
              render={
                <Card className="hover:border-primary/40 cursor-default py-3.5 transition-colors" />
              }
            >
              <CardHeader className="px-4 pb-1">
                <div className="flex items-center justify-between">
                  <CardDescription className="text-xs font-medium">
                    BAC Total
                  </CardDescription>
                  <WalletIcon className="text-muted-foreground size-3.5" />
                </div>
                <CardTitle className="mt-1 font-mono text-base font-bold">
                  {formatCurrency(totalPlannedBudget)}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground px-4 text-[11px]">
                Presupuesto total planificado
              </CardContent>
            </TooltipTrigger>
            <TooltipContent>
              Budget at Completion: Suma del presupuesto planificado de todas las
              actividades.
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={
                <Card className="hover:border-primary/40 cursor-default py-3.5 transition-colors" />
              }
            >
              <CardHeader className="px-4 pb-1">
                <div className="flex items-center justify-between">
                  <CardDescription className="text-xs font-medium">
                    PV (Planificado)
                  </CardDescription>
                  <TargetIcon className="size-3.5 text-blue-500" />
                </div>
                <CardTitle className="mt-1 font-mono text-base font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(consolidatedMetrics.plannedValue)}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground px-4 text-[11px]">
                % planificado × BAC
              </CardContent>
            </TooltipTrigger>
            <TooltipContent>
              Planned Value: Valor del trabajo que debía haberse completado a la
              fecha de corte.
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={
                <Card className="hover:border-primary/40 cursor-default py-3.5 transition-colors" />
              }
            >
              <CardHeader className="px-4 pb-1">
                <div className="flex items-center justify-between">
                  <CardDescription className="text-xs font-medium">
                    EV (Valor Ganado)
                  </CardDescription>
                  <ActivityIcon className="size-3.5 text-emerald-500" />
                </div>
                <CardTitle className="mt-1 font-mono text-base font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(consolidatedMetrics.earnedValue)}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground px-4 text-[11px]">
                % completado × BAC
              </CardContent>
            </TooltipTrigger>
            <TooltipContent>
              Earned Value: Valor presupuestado del trabajo realmente completado.
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={
                <Card className="hover:border-primary/40 cursor-default py-3.5 transition-colors" />
              }
            >
              <CardHeader className="px-4 pb-1">
                <div className="flex items-center justify-between">
                  <CardDescription className="text-xs font-medium">
                    AC (Costo Real)
                  </CardDescription>
                  <CoinsIcon className="size-3.5 text-rose-500" />
                </div>
                <CardTitle className="mt-1 font-mono text-base font-bold text-rose-600 dark:text-rose-400">
                  {formatCurrency(totalActualCost)}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground px-4 text-[11px]">
                Costo incurrido a la fecha
              </CardContent>
            </TooltipTrigger>
            <TooltipContent>
              Actual Cost: Costo total real gastado en las actividades hasta la
              fecha.
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={
                <Card className="hover:border-primary/40 cursor-default py-3.5 transition-colors" />
              }
            >
              <CardHeader className="px-4 pb-1">
                <div className="flex items-center justify-between">
                  <CardDescription className="text-xs font-medium">
                    EAC (Proyección)
                  </CardDescription>
                  <GaugeIcon className="text-muted-foreground size-3.5" />
                </div>
                <CardTitle className="mt-1 font-mono text-base font-bold">
                  {formatCurrency(consolidatedMetrics.eac)}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground px-4 text-[11px]">
                Fórmula: BAC / CPI
              </CardContent>
            </TooltipTrigger>
            <TooltipContent>
              Estimate at Completion: Costo total estimado al finalizar el
              proyecto manteniendo el CPI actual.
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={
                <Card className="hover:border-primary/40 cursor-default py-3.5 transition-colors" />
              }
            >
              <CardHeader className="px-4 pb-1">
                <div className="flex items-center justify-between">
                  <CardDescription className="text-xs font-medium">
                    VAC (Desviación)
                  </CardDescription>
                  <ScaleIcon className="text-muted-foreground size-3.5" />
                </div>
                <CardTitle
                  className={`mt-1 font-mono text-base font-bold ${consolidatedMetrics.vac >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                    }`}
                >
                  {formatCurrency(consolidatedMetrics.vac)}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground px-4 text-[11px]">
                Fórmula: BAC − EAC
              </CardContent>
            </TooltipTrigger>
            <TooltipContent>
              Variance at Completion: Ahorro (+) o sobrecosto (−) proyectado al
              cierre del proyecto.
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
