import type { CostStatus, ScheduleStatus } from "../core/domain/models/evm.model"

export function formatCurrency(amount: number, decimals = 2): string {
  const num = Number.isFinite(amount) ? amount : 0
  const formatted = new Intl.NumberFormat("es-CO", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)
  return `$ ${formatted}`
}

export function formatNumber(value: number, decimals = 2): string {
  const num = Number.isFinite(value) ? value : 0
  return new Intl.NumberFormat("es-CO", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)
}

export function formatPercentage(value: number): string {
  return `${formatNumber(value, 1)}%`
}

export function formatThousandsInput(raw: string): string {
  if (!raw) return ""
  const withoutThousandDots = raw.replace(/\./g, "")
  const clean = withoutThousandDots.replace(/[^\d,]/g, "")
  if (!clean) return ""

  const parts = clean.split(",")
  const intDigits = parts[0] ? parts[0].replace(/^0+(?=\d)/, "") : ""
  const formattedInt = intDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ".")

  if (parts.length > 1) {
    const decPart = parts.slice(1).join("").slice(0, 2)
    return `${formattedInt || "0"},${decPart}`
  }
  return formattedInt
}

export function parseThousandsInput(formatted: string): number {
  if (!formatted) return 0
  const normalized = formatted.replace(/\./g, "").replace(",", ".")
  const parsed = Number.parseFloat(normalized)
  return Number.isFinite(parsed) ? parsed : 0
}

export function numberToThousandsInput(value: number): string {
  if (!Number.isFinite(value)) return "0"
  const [intPart, decPart] = String(value).split(".")
  const formattedInt = (intPart ?? "0").replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  return decPart ? `${formattedInt},${decPart}` : formattedInt
}

export function getCostStatusInfo(status: CostStatus): {
  label: string
  shortLabel: string
  description: string
  variant: "success" | "warning" | "destructive" | "secondary"
} {
  switch (status) {
    case "UNDER_BUDGET":
      return {
        label: "Bajo Presupuesto",
        shortLabel: "Eficiente",
        description: "CPI > 1,00 — Se avanza más de lo que se gasta",
        variant: "success",
      }
    case "ON_BUDGET":
      return {
        label: "En Presupuesto",
        shortLabel: "En Meta",
        description: "CPI = 1,00 — Gasto alineado con el avance",
        variant: "secondary",
      }
    case "OVER_BUDGET":
      return {
        label: "Sobre Presupuesto",
        shortLabel: "Sobrecosto",
        description: "CPI < 1,00 — Se está gastando más de lo que se avanza",
        variant: "destructive",
      }
    case "NO_COST_DATA":
    default:
      return {
        label: "Sin Datos de Costo",
        shortLabel: "Sin Datos",
        description: "AC = 0 o sin actividades registradas",
        variant: "warning",
      }
  }
}

export function getScheduleStatusInfo(status: ScheduleStatus): {
  label: string
  shortLabel: string
  description: string
  variant: "success" | "warning" | "destructive" | "secondary"
} {
  switch (status) {
    case "AHEAD_OF_SCHEDULE":
      return {
        label: "Adelantado",
        shortLabel: "Adelantado",
        description: "SPI > 1,00 — Avance real superior al planificado",
        variant: "success",
      }
    case "ON_SCHEDULE":
      return {
        label: "En Cronograma",
        shortLabel: "A Tiempo",
        description: "SPI = 1,00 — Avance acorde al cronograma",
        variant: "secondary",
      }
    case "BEHIND_SCHEDULE":
      return {
        label: "Atrasado",
        shortLabel: "Atrasado",
        description: "SPI < 1,00 — Avance real inferior al planificado",
        variant: "destructive",
      }
    case "NO_SCHEDULE_DATA":
    default:
      return {
        label: "Sin Datos de Cronograma",
        shortLabel: "Sin Datos",
        description: "PV = 0 o sin actividades registradas",
        variant: "warning",
      }
  }
}
