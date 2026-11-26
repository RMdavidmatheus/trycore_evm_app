import type {
  ActivityRequestDto,
  ActivityResponseDto,
  ProjectRequestDto,
  ProjectResponseDto,
} from "../../application/dtos/evm.dto"
import {
  mapActivityDtoToDomain,
  mapProjectDtoToDomain,
} from "../../application/mappers/evm.mapper"
import type { Activity, Project } from "../../domain/models/evm.model"
import type {
  ActivityServicePort,
  ProjectServicePort,
} from "../../domain/ports/evm.port"
import { httpClient } from "../http/http-client"

export class ProjectApiService implements ProjectServicePort {
  private readonly basePath = "/projects"

  async getAllProjects(): Promise<Project[]> {
    const dtos = await httpClient.get<ProjectResponseDto[]>(this.basePath)
    return dtos.map(mapProjectDtoToDomain)
  }

  async getProjectById(id: string): Promise<Project> {
    const dto = await httpClient.get<ProjectResponseDto>(
      `${this.basePath}/${id}`
    )
    return mapProjectDtoToDomain(dto)
  }

  async createProject(payload: ProjectRequestDto): Promise<Project> {
    const dto = await httpClient.post<ProjectResponseDto, ProjectRequestDto>(
      this.basePath,
      payload
    )
    return mapProjectDtoToDomain(dto)
  }

  async updateProject(
    id: string,
    payload: ProjectRequestDto
  ): Promise<Project> {
    const dto = await httpClient.put<ProjectResponseDto, ProjectRequestDto>(
      `${this.basePath}/${id}`,
      payload
    )
    return mapProjectDtoToDomain(dto)
  }

  async deleteProject(id: string): Promise<void> {
    await httpClient.delete(`${this.basePath}/${id}`)
  }
}

export class ActivityApiService implements ActivityServicePort {
  private getBasePath(projectId: string): string {
    return `/projects/${projectId}/activities`
  }

  async getActivitiesByProjectId(projectId: string): Promise<Activity[]> {
    const dtos = await httpClient.get<ActivityResponseDto[]>(
      this.getBasePath(projectId)
    )
    return dtos.map(mapActivityDtoToDomain)
  }

  async createActivity(
    projectId: string,
    payload: ActivityRequestDto
  ): Promise<Activity> {
    const dto = await httpClient.post<ActivityResponseDto, ActivityRequestDto>(
      this.getBasePath(projectId),
      payload
    )
    return mapActivityDtoToDomain(dto)
  }

  async updateActivity(
    projectId: string,
    activityId: string,
    payload: ActivityRequestDto
  ): Promise<Activity> {
    const dto = await httpClient.put<ActivityResponseDto, ActivityRequestDto>(
      `${this.getBasePath(projectId)}/${activityId}`,
      payload
    )
    return mapActivityDtoToDomain(dto)
  }

  async deleteActivity(projectId: string, activityId: string): Promise<void> {
    await httpClient.delete(`${this.getBasePath(projectId)}/${activityId}`)
  }
}

export const projectService = new ProjectApiService()
export const activityService = new ActivityApiService()
