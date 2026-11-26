"use client"

import { useEffect, useMemo, useState } from "react"
import { CalculatorIcon, DollarSignIcon, PercentIcon } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Separator } from "@workspace/ui/components/separator"
import type { ActivityRequestDto } from "../../core/application/dtos/evm.dto"
import type { Activity } from "../../core/domain/models/evm.model"
import {
  formatCurrency,
  formatNumber,
  formatThousandsInput,
  numberToThousandsInput,
  parseThousandsInput,
} from "../../lib/formatters"

interface ActivityFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Activity | null
  isSubmitting: boolean
  fieldErrors?: Record<string, string>
  onSubmit: (payload: ActivityRequestDto) => Promise<boolean>
}

export function ActivityFormDialog({
  open,
  onOpenChange,
  initialData,
  isSubmitting,
  fieldErrors = {},
  onSubmit,
}: ActivityFormDialogProps) {
  const [name, setName] = useState("")
  const [plannedBudgetText, setPlannedBudgetText] = useState("5.000.000")
  const [actualCostText, setActualCostText] = useState("3.000.000")
  const [plannedPercentage, setPlannedPercentage] = useState("50")
  const [completedPercentage, setCompletedPercentage] = useState("40")

  useEffect(() => {
    if (open) {
      setName(initialData?.name ?? "")
      setPlannedBudgetText(
        initialData
          ? numberToThousandsInput(initialData.plannedBudget)
          : "5.000.000"
      )
      setActualCostText(
        initialData
          ? numberToThousandsInput(initialData.actualCost)
          : "3.000.000"
      )
      setPlannedPercentage(
        initialData ? String(initialData.plannedPercentage) : "50"
      )
      setCompletedPercentage(
        initialData ? String(initialData.completedPercentage) : "40"
      )
    }
  }, [open, initialData])

  const livePreview = useMemo(() => {
    const bac = parseThousandsInput(plannedBudgetText)
    const ac = parseThousandsInput(actualCostText)
    const planPct = Math.min(100, Math.max(0, Number(plannedPercentage) || 0))
    const compPct = Math.min(100, Math.max(0, Number(completedPercentage) || 0))

    const pv = (planPct / 100) * bac
    const ev = (compPct / 100) * bac
    const cpi = ac > 0 ? ev / ac : 0
    const spi = pv > 0 ? ev / pv : 0

    return { bac, ac, pv, ev, cpi, spi }
  }, [
    plannedBudgetText,
    actualCostText,
    plannedPercentage,
    completedPercentage,
  ])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload: ActivityRequestDto = {
      name: name.trim(),
      plannedBudget: parseThousandsInput(plannedBudgetText),
      plannedPercentage: Number(plannedPercentage),
      completedPercentage: Number(completedPercentage),
      actualCost: parseThousandsInput(actualCostText),
    }

    const ok = await onSubmit(payload)
    if (ok) {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Actividad" : "Registrar Nueva Actividad"}
          </DialogTitle>
          <DialogDescription>
            Ingresa el presupuesto y los porcentajes de avance. Los montos se
            formatean automáticamente con separador de miles.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-1">
          <div className="grid gap-2">
            <Label htmlFor="act-name">Nombre de la actividad *</Label>
            <Input
              id="act-name"
              placeholder="Ej. Diseño de Arquitectura Hexagonal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={150}
              required
            />
            {fieldErrors.name && (
              <p className="text-destructive text-xs">{fieldErrors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="act-bac">
                Presupuesto Planificado (BAC) *
              </Label>
              <div className="relative">
                <DollarSignIcon className="text-muted-foreground pointer-events-none absolute top-2.5 left-3 size-4" />
                <Input
                  id="act-bac"
                  type="text"
                  inputMode="decimal"
                  className="pl-8 font-mono"
                  placeholder="0"
                  value={plannedBudgetText}
                  onChange={(e) =>
                    setPlannedBudgetText(formatThousandsInput(e.target.value))
                  }
                  required
                />
              </div>
              {fieldErrors.plannedBudget && (
                <p className="text-destructive text-xs">
                  {fieldErrors.plannedBudget}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="act-ac">Costo Real Incurrido (AC) *</Label>
              <div className="relative">
                <DollarSignIcon className="text-muted-foreground pointer-events-none absolute top-2.5 left-3 size-4" />
                <Input
                  id="act-ac"
                  type="text"
                  inputMode="decimal"
                  className="pl-8 font-mono"
                  placeholder="0"
                  value={actualCostText}
                  onChange={(e) =>
                    setActualCostText(formatThousandsInput(e.target.value))
                  }
                  required
                />
              </div>
              {fieldErrors.actualCost && (
                <p className="text-destructive text-xs">
                  {fieldErrors.actualCost}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="act-planned-pct">
                % Avance Planificado (0 - 100) *
              </Label>
              <div className="relative">
                <Input
                  id="act-planned-pct"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  className="pr-8 font-mono"
                  value={plannedPercentage}
                  onChange={(e) => setPlannedPercentage(e.target.value)}
                  required
                />
                <PercentIcon className="text-muted-foreground pointer-events-none absolute top-2.5 right-3 size-4" />
              </div>
              {fieldErrors.plannedPercentage && (
                <p className="text-destructive text-xs">
                  {fieldErrors.plannedPercentage}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="act-completed-pct">
                % Avance Real Completado (0 - 100) *
              </Label>
              <div className="relative">
                <Input
                  id="act-completed-pct"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  className="pr-8 font-mono"
                  value={completedPercentage}
                  onChange={(e) => setCompletedPercentage(e.target.value)}
                  required
                />
                <PercentIcon className="text-muted-foreground pointer-events-none absolute top-2.5 right-3 size-4" />
              </div>
              {fieldErrors.completedPercentage && (
                <p className="text-destructive text-xs">
                  {fieldErrors.completedPercentage}
                </p>
              )}
            </div>
          </div>

          <div className="bg-muted/40 rounded-xl border p-3.5">
            <div className="mb-2.5 flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                <CalculatorIcon className="size-3.5" />
                Simulación preliminar de Valor Ganado
              </span>
              <div className="flex items-center gap-1.5">
                <Badge
                  variant={
                    livePreview.cpi >= 1
                      ? "success"
                      : livePreview.cpi > 0
                        ? "destructive"
                        : "secondary"
                  }
                >
                  CPI: {formatNumber(livePreview.cpi)}
                </Badge>
                <Badge
                  variant={
                    livePreview.spi >= 1
                      ? "success"
                      : livePreview.spi > 0
                        ? "destructive"
                        : "secondary"
                  }
                >
                  SPI: {formatNumber(livePreview.spi)}
                </Badge>
              </div>
            </div>
            <Separator className="my-2" />
            <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
              <div>
                <p className="text-muted-foreground">BAC (Presupuesto)</p>
                <p className="font-mono font-semibold">
                  {formatCurrency(livePreview.bac)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">PV (Planificado)</p>
                <p className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                  {formatCurrency(livePreview.pv)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">EV (Valor Ganado)</p>
                <p className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(livePreview.ev)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">AC (Costo Real)</p>
                <p className="font-mono font-semibold text-rose-600 dark:text-rose-400">
                  {formatCurrency(livePreview.ac)}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || !name.trim()}>
              {isSubmitting
                ? "Guardando..."
                : initialData
                  ? "Guardar Cambios"
                  : "Registrar Actividad"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
