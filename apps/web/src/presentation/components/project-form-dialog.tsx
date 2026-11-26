"use client"

import { useEffect, useState } from "react"
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
import { Textarea } from "@workspace/ui/components/textarea"
import type { ProjectRequestDto } from "../../core/application/dtos/evm.dto"
import type { Project } from "../../core/domain/models/evm.model"

interface ProjectFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Project | null
  isSubmitting: boolean
  fieldErrors?: Record<string, string>
  onSubmit: (payload: ProjectRequestDto) => Promise<boolean>
}

export function ProjectFormDialog({
  open,
  onOpenChange,
  initialData,
  isSubmitting,
  fieldErrors = {},
  onSubmit,
}: ProjectFormDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    if (open) {
      setName(initialData?.name ?? "")
      setDescription(initialData?.description ?? "")
    }
  }, [open, initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const ok = await onSubmit({
      name: name.trim(),
      description: description.trim(),
    })
    if (ok) {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Proyecto" : "Nuevo Proyecto"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Actualiza el nombre o alcance del proyecto."
              : "Registra un nuevo proyecto para gestionar sus actividades e indicadores EVM."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="project-name">Nombre del proyecto *</Label>
            <Input
              id="project-name"
              placeholder="Ej. Migración Core Bancario"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={150}
              required
            />
            {fieldErrors.name && (
              <p className="text-destructive text-xs">{fieldErrors.name}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="project-description">Descripción</Label>
            <Textarea
              id="project-description"
              placeholder="Descripción breve del alcance del proyecto..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
            />
            {fieldErrors.description && (
              <p className="text-destructive text-xs">
                {fieldErrors.description}
              </p>
            )}
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
                  : "Crear Proyecto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
