'use client'

import * as React from 'react'
import { GripVerticalIcon } from 'lucide-react'
import * as ResizablePrimitive from 'react-resizable-panels'
import { cn } from '@/lib/utils'

// We have COMPLETELY REMOVED the "ComponentProps" line that Vercel is failing on.
function ResizablePanelGroup({ className, ...props }: any) {
  const Group: any = (ResizablePrimitive as any)['PanelGroup']
  return (
    <Group
      data-slot="resizable-panel-group"
      className={cn('flex h-full w-full', className)}
      {...props}
    />
  )
}

function ResizablePanel({ ...props }: any) {
  const Panel: any = (ResizablePrimitive as any)['Panel']
  return <Panel {...props} />
}

function ResizableHandle({ withHandle, className, ...props }: any) {
  const Handle: any = (ResizablePrimitive as any)['PanelResizeHandle']
  return (
    <Handle
      data-slot="resizable-panel-handle"
      className={cn('bg-border relative flex w-px items-center justify-center', className)}
      {...props}
    >
      {withHandle && (
        <div className="bg-border z-10 flex h-4 w-3 items-center justify-center rounded-sm border">
          <GripVerticalIcon className="h-2.5 w-2.5" />
        </div>
      )}
    </Handle>
  )
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }