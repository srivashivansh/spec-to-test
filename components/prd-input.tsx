"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, ClipboardPaste, FileUp, X } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

interface PRDInputProps {
  value: string
  onChange: (value: string) => void
  onGenerate: () => void
  isGenerating: boolean
}

export function PRDInput({ value, onChange, onGenerate, isGenerating }: PRDInputProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      onChange(text)
    } catch (err) {
      console.error("Failed to read clipboard:", err)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type === "text/plain" || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
        const text = await file.text()
        onChange(text)
      }
    } else {
      const text = e.dataTransfer.getData("text")
      if (text) {
        onChange(text)
      }
    }
  }

  const handleClear = () => {
    onChange("")
  }

  const characterCount = value.length
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">PRD Input</h1>
          <p className="text-sm text-muted-foreground">
            Paste or type your Product Requirements Document below
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePaste}
            className="border-border text-foreground hover:bg-secondary"
          >
            <ClipboardPaste className="mr-2 h-4 w-4" />
            Paste
          </Button>
          {value && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Textarea */}
      <div
        className={`relative flex-1 p-6 ${isDragOver ? "bg-primary/5" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragOver && (
          <div className="absolute inset-6 flex items-center justify-center rounded-lg border-2 border-dashed border-primary bg-primary/10 pointer-events-none z-10">
            <div className="flex flex-col items-center gap-2 text-primary">
              <FileUp className="h-8 w-8" />
              <span className="text-sm font-medium">Drop your file here</span>
            </div>
          </div>
        )}
        
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`# Product Requirements Document

## Overview
Describe the feature or product you want to test...

## User Stories
- As a user, I want to...
- As an admin, I want to...

## Acceptance Criteria
1. The system should...
2. Users must be able to...

## Edge Cases
- What happens when...
- How should the system handle...`}
          className="h-full w-full resize-none rounded-lg border border-input bg-card p-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono leading-relaxed"
          disabled={isGenerating}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border px-6 py-4">
        <div className="text-xs text-muted-foreground">
          {characterCount.toLocaleString()} characters • {wordCount.toLocaleString()} words
        </div>
        <Button
          onClick={onGenerate}
          disabled={!value.trim() || isGenerating}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Test Cases
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
