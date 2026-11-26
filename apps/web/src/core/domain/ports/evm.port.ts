import type { Activity, Project } from "../models/evm.model"
import type {
  ActivityRequestDto,
  ProjectRequestDto,
} from "../../application/dtos/evm.dto"

export interface ProjectServicePort {
  getAllProjects(): Promise<Project[]>
  getProjectById(id: string): Promise<Project>
  createProject(payload: ProjectRequestDto): Promise<Project>
  updateProject(id: string, payload: ProjectRequestDto): Promise<Project>
  deleteProject(id: string): Promise<void>
}

export interface ActivityServicePort {
  getActivitiesByProjectId(projectId: string): Promise<Activity[]>
  createActivity(
    projectId: string,
    payload: ActivityRequestDto
  ): Promise<Activity>
  updateActivity(
    projectId: string,
    activityId: string,
    payload: ActivityRequestDto
  ): Promise<Activity>
  deleteActivity(projectId: string, activityId: string): Promise<void>
}
