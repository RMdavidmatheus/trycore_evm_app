"use client"

import { useCallback, useEffect, useState } from "react"
import type {
  ActivityRequestDto,
  ProjectRequestDto,
} from "../../core/application/dtos/evm.dto"
import type { Project } from "../../core/domain/models/evm.model"
import { ApiClientError } from "../../core/infrastructure/http/http-client"
import {
  activityService,
  projectService,
} from "../../core/infrastructure/services/evm-api.service"

export function useEvmTracker() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  )
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const selectedProject =
    projects.find((p) => p.id === selectedProjectId) ?? projects[0] ?? null

  const clearErrors = useCallback(() => {
    setError(null)
    setFieldErrors({})
  }, [])

  const handleApiError = useCallback((err: unknown) => {
    if (err instanceof ApiClientError) {
      setError(`${err.errorTitle}: ${err.message}`)
      if (err.validationErrors) {
        setFieldErrors(err.validationErrors)
      }
    } else if (err instanceof Error) {
      setError(
        `No se pudo conectar con la API Java (http://localhost:3000): ${err.message}`
      )
    } else {
      setError("Ocurrió un error inesperado al procesar la solicitud.")
    }
  }, [])

  const fetchProjects = useCallback(
    async (keepSelectedId?: string) => {
      setIsLoading(true)
      clearErrors()
      try {
        const list = await projectService.getAllProjects()
        setProjects(list)
        if (keepSelectedId) {
          setSelectedProjectId(keepSelectedId)
        } else if (list.length > 0 && !selectedProjectId) {
          setSelectedProjectId(list[0]!.id)
        } else if (list.length === 0) {
          setSelectedProjectId(null)
        }
      } catch (err) {
        handleApiError(err)
      } finally {
        setIsLoading(false)
      }
    },
    [clearErrors, handleApiError, selectedProjectId]
  )

  useEffect(() => {
    void fetchProjects()
  }, [])

  const createProject = async (payload: ProjectRequestDto): Promise<boolean> => {
    setIsSubmitting(true)
    clearErrors()
    try {
      const created = await projectService.createProject(payload)
      await fetchProjects(created.id)
      return true
    } catch (err) {
      handleApiError(err)
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateProject = async (
    id: string,
    payload: ProjectRequestDto
  ): Promise<boolean> => {
    setIsSubmitting(true)
    clearErrors()
    try {
      await projectService.updateProject(id, payload)
      await fetchProjects(id)
      return true
    } catch (err) {
      handleApiError(err)
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  const deleteProject = async (id: string): Promise<boolean> => {
    setIsSubmitting(true)
    clearErrors()
    try {
      await projectService.deleteProject(id)
      const remaining = projects.filter((p) => p.id !== id)
      const nextId = remaining[0]?.id
      await fetchProjects(nextId)
      return true
    } catch (err) {
      handleApiError(err)
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  const createActivity = async (
    projectId: string,
    payload: ActivityRequestDto
  ): Promise<boolean> => {
    setIsSubmitting(true)
    clearErrors()
    try {
      await activityService.createActivity(projectId, payload)
      await fetchProjects(projectId)
      return true
    } catch (err) {
      handleApiError(err)
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateActivity = async (
    projectId: string,
    activityId: string,
    payload: ActivityRequestDto
  ): Promise<boolean> => {
    setIsSubmitting(true)
    clearErrors()
    try {
      await activityService.updateActivity(projectId, activityId, payload)
      await fetchProjects(projectId)
      return true
    } catch (err) {
      handleApiError(err)
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  const deleteActivity = async (
    projectId: string,
    activityId: string
  ): Promise<boolean> => {
    setIsSubmitting(true)
    clearErrors()
    try {
      await activityService.deleteActivity(projectId, activityId)
      await fetchProjects(projectId)
      return true
    } catch (err) {
      handleApiError(err)
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    projects,
    selectedProject,
    selectedProjectId: selectedProject?.id ?? null,
    setSelectedProjectId,
    isLoading,
    isSubmitting,
    error,
    fieldErrors,
    clearErrors,
    refreshProjects: () => fetchProjects(selectedProject?.id),
    createProject,
    updateProject,
    deleteProject,
    createActivity,
    updateActivity,
    deleteActivity,
  }
}
