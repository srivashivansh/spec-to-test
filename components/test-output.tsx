"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Copy, 
  Download, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Check
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface TestCase {
  id: string
  title: string
  category: string
  priority: "high" | "medium" | "low"
  description: string
  preconditions: string[]
  steps: string[]
  expectedResult: string
  status: "pending" | "passed" | "failed"
}

interface TestOutputProps {
  testCases: TestCase[]
  onStatusChange: (id: string, status: TestCase["status"]) => void
}

function PriorityBadge({ priority }: { priority: TestCase["priority"] }) {
  const styles = {
    high: "bg-destructive/20 text-destructive",
    medium: "bg-chart-1/20 text-chart-1",
    low: "bg-muted text-muted-foreground"
  }

  return (
    <span className={cn("px-2 py-0.5 rounded text-xs font-medium uppercase", styles[priority])}>
      {priority}
    </span>
  )
}

function StatusIcon({ status }: { status: TestCase["status"] }) {
  switch (status) {
    case "passed":
      return <CheckCircle2 className="h-5 w-5 text-primary" />
    case "failed":
      return <XCircle className="h-5 w-5 text-destructive" />
    default:
      return <AlertCircle className="h-5 w-5 text-muted-foreground" />
  }
}

function TestCaseCard({ 
  testCase, 
  onStatusChange 
}: { 
  testCase: TestCase
  onStatusChange: (status: TestCase["status"]) => void 
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    const text = `
Test Case: ${testCase.title}
Category: ${testCase.category}
Priority: ${testCase.priority}

Description:
${testCase.description}

Preconditions:
${testCase.preconditions.map((p, i) => `${i + 1}. ${p}`).join("\n")}

Steps:
${testCase.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}

Expected Result:
${testCase.expectedResult}
    `.trim()

    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Header */}
      <div 
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-secondary/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        )}
        <StatusIcon status={testCase.status} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-card-foreground truncate">
              {testCase.title}
            </span>
            <PriorityBadge priority={testCase.priority} />
          </div>
          <span className="text-xs text-muted-foreground">{testCase.category}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation()
            copyToClipboard()
          }}
        >
          {copied ? (
            <Check className="h-4 w-4 text-primary" />
          ) : (
            <Copy className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="sr-only">Copy test case</span>
        </Button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-border px-4 py-4 space-y-4">
          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
              Description
            </h4>
            <p className="text-sm text-card-foreground">{testCase.description}</p>
          </div>

          {testCase.preconditions.length > 0 && (
            <div>
              <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                Preconditions
              </h4>
              <ul className="text-sm text-card-foreground space-y-1">
                {testCase.preconditions.map((precondition, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-muted-foreground">{index + 1}.</span>
                    {precondition}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
              Steps
            </h4>
            <ol className="text-sm text-card-foreground space-y-1">
              {testCase.steps.map((step, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-muted-foreground">{index + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
              Expected Result
            </h4>
            <p className="text-sm text-card-foreground">{testCase.expectedResult}</p>
          </div>

          {/* Status Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground mr-2">Mark as:</span>
            <Button
              variant={testCase.status === "passed" ? "default" : "outline"}
              size="sm"
              onClick={() => onStatusChange("passed")}
              className={cn(
                "h-7",
                testCase.status === "passed" && "bg-primary text-primary-foreground"
              )}
            >
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Passed
            </Button>
            <Button
              variant={testCase.status === "failed" ? "default" : "outline"}
              size="sm"
              onClick={() => onStatusChange("failed")}
              className={cn(
                "h-7",
                testCase.status === "failed" && "bg-destructive text-destructive-foreground"
              )}
            >
              <XCircle className="mr-1 h-3 w-3" />
              Failed
            </Button>
            <Button
              variant={testCase.status === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => onStatusChange("pending")}
              className={cn(
                "h-7",
                testCase.status === "pending" && "bg-secondary text-secondary-foreground"
              )}
            >
              <AlertCircle className="mr-1 h-3 w-3" />
              Pending
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export function TestOutput({ testCases, onStatusChange }: TestOutputProps) {
  const [copied, setCopied] = useState(false)

  const exportAll = () => {
    const content = testCases.map(tc => `
## ${tc.title}
**Category:** ${tc.category}
**Priority:** ${tc.priority}
**Status:** ${tc.status}

### Description
${tc.description}

### Preconditions
${tc.preconditions.map((p, i) => `${i + 1}. ${p}`).join("\n")}

### Steps
${tc.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}

### Expected Result
${tc.expectedResult}

---
    `).join("\n")

    const blob = new Blob([content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "test-cases.md"
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyAll = async () => {
    const content = testCases.map(tc => 
      `${tc.title}\n${tc.description}\nSteps: ${tc.steps.join(", ")}\nExpected: ${tc.expectedResult}`
    ).join("\n\n")
    
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const stats = {
    total: testCases.length,
    passed: testCases.filter(t => t.status === "passed").length,
    failed: testCases.filter(t => t.status === "failed").length,
    pending: testCases.filter(t => t.status === "pending").length,
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Generated Test Cases</h2>
          <p className="text-sm text-muted-foreground">
            {stats.total} test cases • {stats.passed} passed • {stats.failed} failed • {stats.pending} pending
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copyAll}
            className="border-border text-foreground hover:bg-secondary"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4 text-primary" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy All
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportAll}
            className="border-border text-foreground hover:bg-secondary"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Test Cases List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-3">
          {testCases.map((testCase) => (
            <TestCaseCard
              key={testCase.id}
              testCase={testCase}
              onStatusChange={(status) => onStatusChange(testCase.id, status)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
