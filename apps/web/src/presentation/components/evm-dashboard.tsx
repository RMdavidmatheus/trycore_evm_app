"use client"

import { useState } from "react"
import {
  AlertCircleIcon,
  BarChart3Icon,
  LayersIcon,
  LayoutDashboardIcon,
  MoonIcon,
  PencilIcon,
  PlusIcon,
  RefreshCwIcon,
  SunIcon,
  TableIcon,
  Trash2Icon,
} from "lucide-react"
import { useTheme } from "next-themes"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import type { Activity, Project } from "../../core/domain/models/evm.model"
import {
  formatCurrency,
  getCostStatusInfo,
  getScheduleStatusInfo,
} from "../../lib/formatters"
import { useEvmTracker } from "../hooks/use-evm-tracker"
import { ActivitiesTable } from "./activities-table"
import { ActivityFormDialog } from "./activity-form-dialog"
import { ConsolidatedMetricsCards } from "./consolidated-metrics-cards"
import { EvmComparisonChart } from "./evm-comparison-chart"
import { ProjectFormDialog } from "./project-form-dialog"
import { TrycoreLogo } from "./trycore-logo"

export function EvmDashboard() {
  const {
    projects,
    selectedProject,
    selectedProjectId,
    setSelectedProjectId,
    isLoading,
    isSubmitting,
    error,
    fieldErrors,
    clearErrors,
    refreshProjects,
    createProject,
    updateProject,
    deleteProject,
    createActivity,
    updateActivity,
    deleteActivity,
  } = useEvmTracker()

  const { resolvedTheme, setTheme } = useTheme()

  const [projectDialogOpen, setProjectDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  const [activityDialogOpen, setActivityDialogOpen] = useState(false)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)

  const handleOpenNewProject = () => {
    clearErrors()
    setEditingProject(null)
    setProjectDialogOpen(true)
  }

  const handleOpenEditProject = (project: Project) => {
    clearErrors()
    setEditingProject(project)
    setProjectDialogOpen(true)
  }

  const handleDeleteProject = async (project: Project) => {
    await deleteProject(project.id)
  }

  const handleOpenNewActivity = () => {
    clearErrors()
    setEditingActivity(null)
    setActivityDialogOpen(true)
  }

  const handleOpenEditActivity = (activity: Activity) => {
    clearErrors()
    setEditingActivity(activity)
    setActivityDialogOpen(true)
  }

  const handleDeleteActivity = async (activityId: string) => {
    if (!selectedProject) return
    await deleteActivity(selectedProject.id, activityId)
  }

  return (
    <div className="bg-muted/20 min-h-svh">
      <header className="bg-background/85 sticky top-0 z-30 border-b backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-4">
            <TrycoreLogo className="h-9 w-auto shrink-0" />
            <Separator orientation="vertical" className="hidden h-8 sm:block" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight sm:text-lg">
                  EVM Tracker
                </h1>
                <Badge variant="secondary" className="text-[11px]">
                  PMI Standard
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs">
                Plataforma de control presupuestal, seguimiento de cronograma y
                análisis de Valor Ganado en tiempo real
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              title="Cambiar tema claro/oscuro"
            >
              <SunIcon className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <MoonIcon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">Cambiar tema</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => void refreshProjects()}
              disabled={isLoading || isSubmitting}
            >
              <RefreshCwIcon
                className={`size-3.5 ${isLoading ? "animate-spin" : ""}`}
              />
              Sincronizar
            </Button>

            <Button size="sm" onClick={handleOpenNewProject}>
              <PlusIcon className="size-4" />
              Nuevo Proyecto
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1440px] gap-6 px-6 py-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircleIcon className="size-4" />
            <AlertTitle>Notificación del Sistema</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[310px_minmax(0,1fr)]">
          <aside className="flex min-w-0 flex-col gap-3">
            <Card className="min-w-0 overflow-hidden py-4">
              <CardHeader className="px-4 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LayersIcon className="text-muted-foreground size-4" />
                    <CardTitle className="text-sm font-semibold">
                      Portafolio de Proyectos
                    </CardTitle>
                  </div>
                  <Badge variant="secondary">{projects.length}</Badge>
                </div>
                <CardDescription className="text-xs">
                  Selecciona un proyecto para inspeccionar su desempeño EVM
                </CardDescription>
              </CardHeader>

              <CardContent className="grid min-w-0 gap-2.5 px-4 pt-2">
                {isLoading && projects.length === 0 ? (
                  <div className="grid gap-2.5">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ) : projects.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-8 text-center">
                    <p className="text-muted-foreground px-4 text-xs">
                      Aún no tienes proyectos activos registrados en el
                      portafolio.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleOpenNewProject}
                    >
                      <PlusIcon className="size-3.5" />
                      Crear primer proyecto
                    </Button>
                  </div>
                ) : (
                  projects.map((project) => {
                    const isSelected = project.id === selectedProjectId
                    const costStatus = getCostStatusInfo(
                      project.consolidatedMetrics.costStatus
                    )
                    const scheduleStatus = getScheduleStatusInfo(
                      project.consolidatedMetrics.scheduleStatus
                    )

                    return (
                      <div
                        key={project.id}
                        onClick={() => setSelectedProjectId(project.id)}
                        className={`group min-w-0 overflow-hidden cursor-pointer rounded-xl border p-3.5 transition-all ${isSelected
                            ? "border-primary bg-primary/5 shadow-xs"
                            : "bg-card hover:border-primary/40 hover:bg-muted/40"
                          }`}
                      >
                        <div className="flex min-w-0 items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p
                              className="truncate text-sm font-semibold"
                              title={project.name}
                            >
                              {project.name}
                            </p>
                            {project.description && (
                              <p
                                className="text-muted-foreground mt-0.5 truncate text-xs"
                                title={project.description}
                              >
                                {project.description}
                              </p>
                            )}
                          </div>
                          <Badge variant="outline" className="shrink-0">
                            {project.activities.length} act.
                          </Badge>
                        </div>

                        <Separator className="my-2.5" />

                        <div className="flex min-w-0 items-center justify-between gap-2 text-xs">
                          <span className="text-muted-foreground shrink-0">
                            BAC:
                          </span>
                          <span className="truncate font-mono font-semibold">
                            {formatCurrency(project.totalPlannedBudget)}
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          <Badge
                            variant={costStatus.variant}
                            className="text-[10px]"
                          >
                            CPI {project.consolidatedMetrics.cpi.toFixed(2)} ·{" "}
                            {costStatus.shortLabel}
                          </Badge>
                          <Badge
                            variant={scheduleStatus.variant}
                            className="text-[10px]"
                          >
                            SPI {project.consolidatedMetrics.spi.toFixed(2)} ·{" "}
                            {scheduleStatus.shortLabel}
                          </Badge>
                        </div>
                      </div>
                    )
                  })
                )}
              </CardContent>
            </Card>
          </aside>

          <section className="flex min-w-0 flex-col gap-6">
            {!selectedProject ? (
              <Card className="py-20">
                <CardHeader className="items-center text-center">
                  <div className="bg-primary/10 text-primary mb-2 flex size-12 items-center justify-center rounded-2xl">
                    <LayoutDashboardIcon className="size-6" />
                  </div>
                  <CardTitle className="text-lg">
                    Comienza tu análisis de Valor Ganado (EVM)
                  </CardTitle>
                  <CardDescription className="max-w-md">
                    Crea o selecciona un proyecto para registrar sus actividades,
                    controlar desviaciones de presupuesto y monitorear el
                    cumplimiento del cronograma en tiempo real.
                  </CardDescription>
                  <div className="pt-4">
                    <Button onClick={handleOpenNewProject}>
                      <PlusIcon className="size-4" />
                      Crear Nuevo Proyecto
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ) : (
              <>
                <Card className="min-w-0 overflow-hidden py-5">
                  <CardHeader>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <CardTitle className="break-words text-xl font-bold">
                            {selectedProject.name}
                          </CardTitle>
                          <Badge variant="outline" className="shrink-0">
                            {selectedProject.activities.length}{" "}
                            {selectedProject.activities.length === 1
                              ? "actividad registrada"
                              : "actividades registradas"}
                          </Badge>
                        </div>
                        <CardDescription className="break-words">
                          {selectedProject.description ||
                            "Proyecto activo bajo seguimiento de metodología de Valor Ganado (EVM)."}
                        </CardDescription>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={handleOpenNewActivity}
                          disabled={isSubmitting}
                        >
                          <PlusIcon className="size-4" />
                          Agregar Actividad
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleOpenEditProject(selectedProject)
                          }
                          disabled={isSubmitting}
                        >
                          <PencilIcon className="size-3.5" />
                          Editar Proyecto
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            void handleDeleteProject(selectedProject)
                          }
                          disabled={isSubmitting}
                        >
                          <Trash2Icon className="size-3.5" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                <ConsolidatedMetricsCards project={selectedProject} />

                <Tabs defaultValue="table" className="w-full min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <TabsList>
                      <TabsTrigger value="table">
                        <TableIcon className="size-4" />
                        Tabla de Actividades ({selectedProject.activities.length})
                      </TabsTrigger>
                      <TabsTrigger value="chart">
                        <BarChart3Icon className="size-4" />
                        Gráfica Comparativa (PV / EV / AC)
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="table" className="mt-3 min-w-0">
                    <ActivitiesTable
                      activities={selectedProject.activities}
                      isSubmitting={isSubmitting}
                      onAddActivity={handleOpenNewActivity}
                      onEditActivity={handleOpenEditActivity}
                      onDeleteActivity={(id) => void handleDeleteActivity(id)}
                    />
                  </TabsContent>

                  <TabsContent value="chart" className="mt-3 min-w-0">
                    <EvmComparisonChart
                      activities={selectedProject.activities}
                    />
                  </TabsContent>
                </Tabs>
              </>
            )}
          </section>
        </div>
      </main>

      <ProjectFormDialog
        open={projectDialogOpen}
        onOpenChange={setProjectDialogOpen}
        initialData={editingProject}
        isSubmitting={isSubmitting}
        fieldErrors={fieldErrors}
        onSubmit={(payload) =>
          editingProject
            ? updateProject(editingProject.id, payload)
            : createProject(payload)
        }
      />

      <ActivityFormDialog
        open={activityDialogOpen}
        onOpenChange={setActivityDialogOpen}
        initialData={editingActivity}
        isSubmitting={isSubmitting}
        fieldErrors={fieldErrors}
        onSubmit={(payload) => {
          if (!selectedProject) return Promise.resolve(false)
          return editingActivity
            ? updateActivity(selectedProject.id, editingActivity.id, payload)
            : createActivity(selectedProject.id, payload)
        }}
      />
    </div>
  )
}
