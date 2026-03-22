"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { 
  FileText, 
  Plus, 
  Search, 
  Clock, 
  MoreHorizontal,
  Trash2,
  FolderOpen
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Project {
  id: string
  name: string
  timestamp: string
  testCount: number
}

interface ProjectSidebarProps {
  projects: Project[]
  selectedProjectId: string | null
  onSelectProject: (id: string) => void
  onNewProject: () => void
  onDeleteProject: (id: string) => void
}

export function ProjectSidebar({
  projects,
  selectedProjectId,
  onSelectProject,
  onNewProject,
  onDeleteProject,
}: ProjectSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <aside className="flex h-full w-72 flex-col border-r border-border bg-sidebar">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <FileText className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sidebar-foreground">Spec-to-Test</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onNewProject}
          className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">New project</span>
        </Button>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-md border border-sidebar-border bg-sidebar-accent pl-9 pr-3 text-sm text-sidebar-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-sidebar-ring"
          />
        </div>
      </div>

      {/* Project List */}
      <div className="flex-1 overflow-y-auto px-2">
        <div className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Recent Projects
        </div>
        
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
            <FolderOpen className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No projects yet</p>
            <p className="text-xs text-muted-foreground">Create a new project to get started</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className={cn(
                  "group flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors cursor-pointer",
                  selectedProjectId === project.id
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
                onClick={() => onSelectProject(project.id)}
              >
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{project.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{project.timestamp}</span>
                    <span>•</span>
                    <span>{project.testCount} tests</span>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Project options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteProject(project.id)
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete project
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <Button
          onClick={onNewProject}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>
    </aside>
  )
}
