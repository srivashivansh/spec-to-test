// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={100}
//           height={20}
//           priority
//         />
//         <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
//           <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
//             To get started, edit the page.tsx file.
//           </h1>
//           <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
//             Looking for a starting point or more instructions? Head over to{" "}
//             <a
//               href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Templates
//             </a>{" "}
//             or the{" "}
//             <a
//               href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Learning
//             </a>{" "}
//             center.
//           </p>
//         </div>
//         <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
//           <a
//             className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={16}
//               height={16}
//             />
//             Deploy Now
//           </a>
//           <a
//             className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Documentation
//           </a>
//         </div>
//       </main>
//     </div>
//   );
// }


"use client"

import { useState, useCallback } from "react"
import { ProjectSidebar } from "@/components/project-sidebar"
import { PRDInput } from "@/components/prd-input"
import { TestOutput, TestCase } from "@/components/test-output"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Project {
  id: string
  name: string
  timestamp: string
  testCount: number
  prdContent: string
  testCases: TestCase[]
}

// Sample data for demonstration
const sampleProjects: Project[] = [
  {
    id: "1",
    name: "User Authentication Flow",
    timestamp: "2 hours ago",
    testCount: 12,
    prdContent: `# User Authentication PRD

## Overview
Implement a secure user authentication system with email/password login, social OAuth, and two-factor authentication.

## User Stories
- As a user, I want to sign up with my email and password
- As a user, I want to log in with Google or GitHub
- As a user, I want to enable 2FA for extra security

## Acceptance Criteria
1. Password must be at least 8 characters with uppercase, lowercase, and numbers
2. OAuth should redirect to the original page after login
3. 2FA codes should expire after 30 seconds`,
    testCases: [
      {
        id: "tc1",
        title: "Valid email/password registration",
        category: "Registration",
        priority: "high",
        description: "Verify that users can register with a valid email and password meeting all requirements",
        preconditions: ["User is on the registration page", "User does not have an existing account"],
        steps: [
          "Enter a valid email address",
          "Enter a password with 8+ characters including uppercase, lowercase, and numbers",
          "Confirm the password",
          "Click the Register button"
        ],
        expectedResult: "User account is created and user is redirected to the dashboard with a success message",
        status: "pending"
      },
      {
        id: "tc2",
        title: "Weak password rejection",
        category: "Registration",
        priority: "high",
        description: "Verify that the system rejects passwords that don't meet security requirements",
        preconditions: ["User is on the registration page"],
        steps: [
          "Enter a valid email address",
          "Enter a weak password (e.g., 'password123')",
          "Click the Register button"
        ],
        expectedResult: "Error message appears indicating password requirements not met",
        status: "passed"
      },
      {
        id: "tc3",
        title: "Google OAuth login",
        category: "OAuth",
        priority: "medium",
        description: "Verify that users can log in using their Google account",
        preconditions: ["User has a valid Google account", "User is on the login page"],
        steps: [
          "Click the 'Continue with Google' button",
          "Select or enter Google account credentials",
          "Authorize the application"
        ],
        expectedResult: "User is logged in and redirected to the dashboard",
        status: "pending"
      }
    ]
  },
  {
    id: "2",
    name: "Shopping Cart Module",
    timestamp: "1 day ago",
    testCount: 8,
    prdContent: "",
    testCases: []
  },
  {
    id: "3",
    name: "Payment Integration",
    timestamp: "3 days ago",
    testCount: 15,
    prdContent: "",
    testCases: []
  }
]

export default function SpecToTestPage() {
  const [projects, setProjects] = useState<Project[]>(sampleProjects)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>("1")
  const [prdContent, setPrdContent] = useState(sampleProjects[0].prdContent)
  const [testCases, setTestCases] = useState<TestCase[]>(sampleProjects[0].testCases)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const selectedProject = projects.find(p => p.id === selectedProjectId)

  const handleSelectProject = useCallback((id: string) => {
    const project = projects.find(p => p.id === id)
    if (project) {
      setSelectedProjectId(id)
      setPrdContent(project.prdContent)
      setTestCases(project.testCases)
    }
    setIsSidebarOpen(false)
  }, [projects])

  const handleNewProject = useCallback(() => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: "Untitled Project",
      timestamp: "Just now",
      testCount: 0,
      prdContent: "",
      testCases: []
    }
    setProjects(prev => [newProject, ...prev])
    setSelectedProjectId(newProject.id)
    setPrdContent("")
    setTestCases([])
    setIsSidebarOpen(false)
  }, [])

  const handleDeleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id))
    if (selectedProjectId === id) {
      const remaining = projects.filter(p => p.id !== id)
      if (remaining.length > 0) {
        handleSelectProject(remaining[0].id)
      } else {
        setSelectedProjectId(null)
        setPrdContent("")
        setTestCases([])
      }
    }
  }, [selectedProjectId, projects, handleSelectProject])

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true)
    
    // Simulate AI generation with a delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Generate sample test cases based on PRD content
    const generatedTests: TestCase[] = [
      {
        id: `tc-${Date.now()}-1`,
        title: "Verify primary functionality",
        category: "Functional",
        priority: "high",
        description: "Ensure the main feature works as described in the PRD",
        preconditions: ["System is in a clean state", "User is authenticated"],
        steps: [
          "Navigate to the feature page",
          "Perform the primary action",
          "Verify the expected outcome"
        ],
        expectedResult: "Feature behaves as specified in the requirements",
        status: "pending"
      },
      {
        id: `tc-${Date.now()}-2`,
        title: "Input validation test",
        category: "Validation",
        priority: "high",
        description: "Verify that invalid inputs are properly rejected with appropriate error messages",
        preconditions: ["User is on the input form"],
        steps: [
          "Enter invalid data in required fields",
          "Submit the form",
          "Check for error messages"
        ],
        expectedResult: "Clear error messages are displayed for each validation failure",
        status: "pending"
      },
      {
        id: `tc-${Date.now()}-3`,
        title: "Edge case: Empty state handling",
        category: "Edge Cases",
        priority: "medium",
        description: "Verify the system handles empty or null values gracefully",
        preconditions: ["No data exists in the system"],
        steps: [
          "Access the feature with no existing data",
          "Verify empty state message is displayed",
          "Confirm CTA to add data is visible"
        ],
        expectedResult: "Appropriate empty state UI is shown with guidance for users",
        status: "pending"
      },
      {
        id: `tc-${Date.now()}-4`,
        title: "Performance under load",
        category: "Performance",
        priority: "low",
        description: "Verify the feature performs acceptably under expected load",
        preconditions: ["Performance testing environment is set up"],
        steps: [
          "Simulate 100 concurrent users",
          "Execute the primary workflow",
          "Measure response times"
        ],
        expectedResult: "Response time stays under 200ms for 95th percentile",
        status: "pending"
      },
      {
        id: `tc-${Date.now()}-5`,
        title: "Accessibility compliance",
        category: "Accessibility",
        priority: "medium",
        description: "Ensure the feature meets WCAG 2.1 AA standards",
        preconditions: ["Feature is deployed to staging environment"],
        steps: [
          "Run automated accessibility scan",
          "Test keyboard navigation",
          "Verify screen reader compatibility"
        ],
        expectedResult: "No critical accessibility violations are found",
        status: "pending"
      }
    ]

    setTestCases(generatedTests)
    
    // Update project with new test cases
    setProjects(prev => prev.map(p => 
      p.id === selectedProjectId 
        ? { ...p, prdContent, testCases: generatedTests, testCount: generatedTests.length }
        : p
    ))

    setIsGenerating(false)
  }, [prdContent, selectedProjectId])

  const handleStatusChange = useCallback((testId: string, status: TestCase["status"]) => {
    setTestCases(prev => prev.map(tc =>
      tc.id === testId ? { ...tc, status } : tc
    ))
  }, [])

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 lg:static lg:z-0
        transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <ProjectSidebar
          projects={projects}
          selectedProjectId={selectedProjectId}
          onSelectProject={handleSelectProject}
          onNewProject={handleNewProject}
          onDeleteProject={handleDeleteProject}
        />
      </div>

      {/* Main content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          <span className="font-semibold text-foreground">
            {selectedProject?.name || "Spec-to-Test"}
          </span>
          <div className="w-10" />
        </div>

        {/* Split view */}
        <div className="flex flex-1 overflow-hidden">
          {/* PRD Input Section */}
          <div className="flex-1 border-r border-border overflow-hidden">
            <PRDInput
              value={prdContent}
              onChange={setPrdContent}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </div>

          {/* Test Output Section */}
          <div className="hidden flex-1 overflow-hidden lg:flex lg:flex-col">
            {testCases.length > 0 ? (
              <TestOutput
                testCases={testCases}
                onStatusChange={handleStatusChange}
              />
            ) : (
              <div className="flex flex-1 items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                    <svg
                      className="h-8 w-8 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-foreground">No test cases yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Paste your PRD and click &quot;Generate Test Cases&quot; to get started
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile test output (shown below on smaller screens) */}
        {testCases.length > 0 && (
          <div className="flex-1 overflow-hidden border-t border-border lg:hidden">
            <TestOutput
              testCases={testCases}
              onStatusChange={handleStatusChange}
            />
          </div>
        )}
      </main>
    </div>
  )
}
