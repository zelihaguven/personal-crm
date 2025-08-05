"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// Types
interface Application {
  id: number
  companyName: string
  position: string
  jobDescription: string
  applicationDate: string
  status: "Beklemede" | "Red" | "Kabul"
  notes: string
}

interface CommunityTask {
  id: number
  communityName: string
  title: string
  weeklyTasks: string
  notes: string
  reminderDate: string
}

interface Project {
  id: number
  projectName: string
  subject: string
  postDescription: string
  blogTitle: string
  blogSubject: string
  shareDate: string
  designStatus: "Yapıldı" | "Yapılmadı"
}

interface Course {
  id: number
  courseName: string
  instructor: string
  resource: string
  description: string
  midtermDate: string
  finalDate: string
}

// Context Type
interface DataContextType {
  // Data
  applications: Application[]
  communityTasks: CommunityTask[]
  projects: Project[]
  courses: Course[]

  // Applications
  addApplication: (application: Omit<Application, "id">) => void
  updateApplication: (id: number, application: Omit<Application, "id">) => void
  deleteApplication: (id: number) => void

  // Community Tasks
  addCommunityTask: (task: Omit<CommunityTask, "id">) => void
  updateCommunityTask: (id: number, task: Omit<CommunityTask, "id">) => void
  deleteCommunityTask: (id: number) => void

  // Projects
  addProject: (project: Omit<Project, "id">) => void
  updateProject: (id: number, project: Omit<Project, "id">) => void
  deleteProject: (id: number) => void

  // Courses
  addCourse: (course: Omit<Course, "id">) => void
  updateCourse: (id: number, course: Omit<Course, "id">) => void
  deleteCourse: (id: number) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<Application[]>([])
  const [communityTasks, setCommunityTasks] = useState<CommunityTask[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [courses, setCourses] = useState<Course[]>([])

  // Applications
  const addApplication = (application: Omit<Application, "id">) => {
    const newApplication = { ...application, id: Date.now() }
    setApplications((prev) => [...prev, newApplication])
  }

  const updateApplication = (id: number, application: Omit<Application, "id">) => {
    setApplications((prev) => prev.map((app) => (app.id === id ? { ...application, id } : app)))
  }

  const deleteApplication = (id: number) => {
    setApplications((prev) => prev.filter((app) => app.id !== id))
  }

  // Community Tasks
  const addCommunityTask = (task: Omit<CommunityTask, "id">) => {
    const newTask = { ...task, id: Date.now() }
    setCommunityTasks((prev) => [...prev, newTask])
  }

  const updateCommunityTask = (id: number, task: Omit<CommunityTask, "id">) => {
    setCommunityTasks((prev) => prev.map((t) => (t.id === id ? { ...task, id } : t)))
  }

  const deleteCommunityTask = (id: number) => {
    setCommunityTasks((prev) => prev.filter((t) => t.id !== id))
  }

  // Projects
  const addProject = (project: Omit<Project, "id">) => {
    const newProject = { ...project, id: Date.now() }
    setProjects((prev) => [...prev, newProject])
  }

  const updateProject = (id: number, project: Omit<Project, "id">) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...project, id } : p)))
  }

  const deleteProject = (id: number) => {
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }

  // Courses
  const addCourse = (course: Omit<Course, "id">) => {
    const newCourse = { ...course, id: Date.now() }
    setCourses((prev) => [...prev, newCourse])
  }

  const updateCourse = (id: number, course: Omit<Course, "id">) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...course, id } : c)))
  }

  const deleteCourse = (id: number) => {
    setCourses((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <DataContext.Provider
      value={{
        applications,
        communityTasks,
        projects,
        courses,
        addApplication,
        updateApplication,
        deleteApplication,
        addCommunityTask,
        updateCommunityTask,
        deleteCommunityTask,
        addProject,
        updateProject,
        deleteProject,
        addCourse,
        updateCourse,
        deleteCourse,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}

// Export types
export type { Application, CommunityTask, Project, Course }
