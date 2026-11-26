"use client"

import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Progress } from "@workspace/ui/components/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import type { Activity } from "../../core/domain/models/evm.model"
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
  getCostStatusInfo,
  getScheduleStatusInfo,
} from "../../lib/formatters"

interface ActivitiesTableProps {
  activities: Activity[]
  isSubmitting: boolean
  onAddActivity: () => void
  onEditActivity: (activity: Activity) => void
  onDeleteActivity: (activityId: string) => void
}

export function ActivitiesTable({
  activities,
  isSubmitting,
  onAddActivity,
  onEditActivity,
  onDeleteActivity,
}: ActivitiesTableProps) {
  return (
    <Card className="min-w-0 overflow-hidden">
      <CardHeader className="border-b pb-4">
        <div>
          <CardTitle className="text-base">
            Desglose de Actividades e Indicadores EVM ({activities.length})
          </CardTitle>
          <CardDescription>
            Seguimiento individual de presupuesto, avance físico y eficiencia por
            actividad
          </CardDescription>
        </div>
        <CardAction>
          <Button size="sm" onClick={onAddActivity} disabled={isSubmitting}>
            <PlusIcon className="size-4" />
            Nueva Actividad
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="min-w-0 pt-2">
        {activities.length === 0 ? (
          <div className="text-muted-foreground flex flex-col items-center justify-center rounded-xl border border-dashed py-12 text-center text-sm">
            <p className="font-medium text-foreground">
              Sin actividades registradas en este proyecto
            </p>
            <p className="mt-1 max-w-md text-xs">
              Agrega las actividades del cronograma con su presupuesto (BAC),
              avance planificado, avance real y costo actual (AC) para calcular
              automáticamente el Valor Ganado.
            </p>
            <Button
              variant="default"
              size="sm"
              className="mt-4"
              onClick={onAddActivity}
            >
              <PlusIcon className="size-4" />
              Registrar primera actividad
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="min-w-[180px]">Actividad</TableHead>
                <TableHead className="text-right">BAC</TableHead>
                <TableHead className="min-w-[130px]">Avance (Real / Plan)</TableHead>
                <TableHead className="text-right">AC (Costo Real)</TableHead>
                <TableHead className="text-right">PV</TableHead>
                <TableHead className="text-right">EV</TableHead>
                <TableHead className="text-right">CV</TableHead>
                <TableHead className="text-right">SV</TableHead>
                <TableHead className="text-right">CPI</TableHead>
                <TableHead className="text-right">SPI</TableHead>
                <TableHead className="text-right">EAC</TableHead>
                <TableHead className="text-right">VAC</TableHead>
                <TableHead>Diagnóstico EVM</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => {
                const { metrics } = activity
                const costStatus = getCostStatusInfo(metrics.costStatus)
                const scheduleStatus = getScheduleStatusInfo(
                  metrics.scheduleStatus
                )

                return (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">
                      {activity.name}
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium">
                      {formatCurrency(activity.plannedBudget)}
                    </TableCell>
                    <TableCell>
                      <div className="grid gap-1">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {formatPercentage(activity.completedPercentage)}
                          </span>
                          <span className="text-muted-foreground">
                            / {formatPercentage(activity.plannedPercentage)}
                          </span>
                        </div>
                        <Progress value={activity.completedPercentage} />
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-rose-600 dark:text-rose-400">
                      {formatCurrency(activity.actualCost)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-blue-600 dark:text-blue-400">
                      {formatCurrency(metrics.plannedValue)}
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(metrics.earnedValue)}
                    </TableCell>
                    <TableCell
                      className={`text-right font-mono ${
                        metrics.costVariance < 0
                          ? "text-rose-600 dark:text-rose-400"
                          : ""
                      }`}
                    >
                      {formatCurrency(metrics.costVariance)}
                    </TableCell>
                    <TableCell
                      className={`text-right font-mono ${
                        metrics.scheduleVariance < 0
                          ? "text-amber-600 dark:text-amber-400"
                          : ""
                      }`}
                    >
                      {formatCurrency(metrics.scheduleVariance)}
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold">
                      {formatNumber(metrics.cpi)}
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold">
                      {formatNumber(metrics.spi)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(metrics.eac)}
                    </TableCell>
                    <TableCell
                      className={`text-right font-mono ${
                        metrics.vac < 0
                          ? "text-rose-600 dark:text-rose-400"
                          : "text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {formatCurrency(metrics.vac)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant={costStatus.variant}>
                          {costStatus.label}
                        </Badge>
                        <Badge variant={scheduleStatus.variant}>
                          {scheduleStatus.label}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="outline"
                          size="icon-sm"
                          onClick={() => onEditActivity(activity)}
                          disabled={isSubmitting}
                          title="Editar actividad"
                        >
                          <PencilIcon className="size-3.5" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon-sm"
                          onClick={() => onDeleteActivity(activity.id)}
                          disabled={isSubmitting}
                          title="Eliminar actividad"
                        >
                          <Trash2Icon className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
