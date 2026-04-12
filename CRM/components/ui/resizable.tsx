"use client";

import * as React from "react";
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from "react-resizable-panels";

import { cn } from "./utils";

type ResizablePanelProps = React.ComponentProps<typeof Panel>;

function ResizablePanelGroup({
  className,
  ...props
}: React.ComponentProps<typeof PanelGroup>) {
  return (
    <PanelGroup
      data-slot="resizable-panel-group"
      className={cn("flex h-full w-full data-[panel-group-direction=vertical]:flex-col", className)}
      {...props}
    />
  );
}

function ResizablePanel(props: ResizablePanelProps) {
  return (
    <Panel
      data-slot="resizable-panel"
      {...props}
    />
  );
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof PanelResizeHandle> & {
  withHandle?: boolean;
}) {
  return (
    <PanelResizeHandle
      data-slot="resizable-handle"
      className={cn(
        "bg-border focus-visible:ring-ring/50 relative flex w-px select-none touch-none items-center justify-center bg-border transition-colors after:absolute after:inset-0 hover:bg-border-hover focus-visible:outline-hidden focus-visible:ring-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full",
        withHandle && "after:h-12 after:w-1 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-12",
        className,
      )}
      {...props}
    />
  );
}

export {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
};