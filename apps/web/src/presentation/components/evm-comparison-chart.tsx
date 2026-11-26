"use client"

import { BarChart3Icon } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import type { Activity } from "../../core/domain/models/evm.model"
import { formatCurrency, formatNumber } from "../../lib/formatters"

interface EvmComparisonChartProps {
  activities: Activity[]
}

export function EvmComparisonChart({ activities }: EvmComparisonChartProps) {
  if (activities.length === 0) {
    return (
      <Card className="py-12">
        <CardContent className="text-muted-foreground flex flex-col items-center justify-center text-center text-sm">
          <BarChart3Icon className="mb-2 size-8 opacity-40" />
          <p>Registra actividades para visualizar la gráfica comparativa EVM.</p>
        </CardContent>
      </Card>
    )
  }

  const maxValue = Math.max(
    1,
    ...activities.flatMap((a) => [
      a.plannedBudget,
      a.metrics.plannedValue,
      a.metrics.earnedValue,
      a.actualCost,
    ])
  )

  return (
    <Card>
      <CardHeader className="border-b pb-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base">
              Análisis Gráfico: PV vs EV vs AC por Actividad
            </CardTitle>
            <CardDescription>
              Comparación visual entre el Valor Planificado (PV), el Valor Ganado
              (EV) y el Costo Real Incurrido (AC)
            </CardDescription>
          </div>
          <div className="bg-muted/40 flex flex-wrap items-center gap-4 rounded-lg border px-3 py-1.5 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="inline-block size-3 rounded-xs bg-blue-500" />
              <span className="font-medium">PV (Planificado)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block size-3 rounded-xs bg-emerald-500" />
              <span className="font-medium">EV (Valor Ganado)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block size-3 rounded-xs bg-rose-500" />
              <span className="font-medium">AC (Costo Real)</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid gap-4 pt-4">
        {activities.map((activity) => {
          const pvPct = Math.max(
            2,
            Math.round((activity.metrics.plannedValue / maxValue) * 100)
          )
          const evPct = Math.max(
            2,
            Math.round((activity.metrics.earnedValue / maxValue) * 100)
          )
          const acPct = Math.max(
            2,
            Math.round((activity.actualCost / maxValue) * 100)
          )

          return (
            <div
              key={activity.id}
              className="bg-card hover:bg-muted/20 grid gap-3 rounded-xl border p-4 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{activity.name}</span>
                  <Badge variant="outline" className="font-mono text-xs">
                    BAC: {formatCurrency(activity.plannedBudget)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      activity.metrics.cpi >= 1 ? "success" : "destructive"
                    }
                    className="font-mono"
                  >
                    CPI: {formatNumber(activity.metrics.cpi)}
                  </Badge>
                  <Badge
                    variant={
                      activity.metrics.spi >= 1 ? "success" : "destructive"
                    }
                    className="font-mono"
                  >
                    SPI: {formatNumber(activity.metrics.spi)}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-2 text-xs">
                <div className="grid grid-cols-[95px_1fr_130px] items-center gap-3">
                  <span className="text-muted-foreground font-medium">
                    PV ({formatNumber(activity.plannedPercentage, 0)}%)
                  </span>
                  <div className="bg-muted h-3 w-full overflow-hidden rounded-full">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-500"
                      style={{
                        width: `${activity.metrics.plannedValue > 0 ? pvPct : 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-right font-mono font-medium text-blue-600 dark:text-blue-400">
                    {formatCurrency(activity.metrics.plannedValue)}
                  </span>
                </div>

                <div className="grid grid-cols-[95px_1fr_130px] items-center gap-3">
                  <span className="text-muted-foreground font-medium">
                    EV ({formatNumber(activity.completedPercentage, 0)}%)
                  </span>
                  <div className="bg-muted h-3 w-full overflow-hidden rounded-full">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                      style={{
                        width: `${activity.metrics.earnedValue > 0 ? evPct : 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-right font-mono font-medium text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(activity.metrics.earnedValue)}
                  </span>
                </div>

                <div className="grid grid-cols-[95px_1fr_130px] items-center gap-3">
                  <span className="text-muted-foreground font-medium">
                    AC (Incurrido)
                  </span>
                  <div className="bg-muted h-3 w-full overflow-hidden rounded-full">
                    <div
                      className="h-full rounded-full bg-rose-500 transition-all duration-500"
                      style={{
                        width: `${activity.actualCost > 0 ? acPct : 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-right font-mono font-medium text-rose-600 dark:text-rose-400">
                    {formatCurrency(activity.actualCost)}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
