"use client"

import * as React from "react"
import type { ToastActionElement, ToastProps } from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

export function useToast() {
  const [state, setState] = React.useState<{ toasts: ToasterToast[] }>({
    toasts: [],
  })

  const toast = React.useCallback(({ ...props }: Omit<ToasterToast, "id">) => {
    const id = genId()
    setState((state) => ({
      ...state,
      toasts: [{ ...props, id }, ...state.toasts].slice(0, TOAST_LIMIT),
    }))
    return id
  }, [])

  const dismiss = React.useCallback((toastId?: string) => {
    setState((state) => ({
      ...state,
      toasts: state.toasts.filter((t) => t.id !== toastId),
    }))
  }, [])

  return {
    ...state,
    toast,
    dismiss,
  }
}