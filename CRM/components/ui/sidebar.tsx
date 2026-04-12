"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { PanelLeftIcon } from "lucide-react";

import { cn } from "./utils";
import { Button } from "./button";

const SIDEBAR_COOKIE_NAME = "sidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";

type SidebarContext = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContext | undefined>(
  undefined,
);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }

  return context;
}

interface SidebarProviderProps extends React.ComponentProps<"div"> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const SidebarProvider = React.forwardRef<HTMLDivElement, SidebarProviderProps>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const [openMobile, setOpenMobile] = React.useState(false);
    const [_open, _setOpen] = React.useState(defaultOpen);
    const open = openProp ?? _open;
    const setOpen = React.useCallback(
      (value: boolean | ((state: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value;
        if (setOpenProp) {
          setOpenProp(openState);
        } else {
          _setOpen(openState);
        }

        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
      },
      [open, setOpenProp],
    );

    const isMobile = React.useMemo(() => {
      if (typeof window === "undefined") return false;
      return window.innerWidth < 768;
    }, []);

    const state = open ? "expanded" : "collapsed";

    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open);
    }, [isMobile, setOpen]);

    const value: SidebarContext = {
      state,
      open,
      setOpen,
      openMobile,
      setOpenMobile,
      isMobile,
      toggleSidebar,
    };

    return (
      <SidebarContext.Provider value={value}>
        <div
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            "group/sidebar-wrapper flex h-screen w-full has-data-[variant=inset]:bg-sidebar",
            className,
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      </SidebarContext.Provider>
    );
  },
);
SidebarProvider.displayName = "SidebarProvider";

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    side?: "left" | "right";
    variant?: "sidebar" | "floating" | "inset";
    collapsible?: "offcanvas" | "icon" | "none";
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

    if (collapsible === "none") {
      return (
        <div
          data-slot="sidebar"
          className={cn(
            "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground",
            className,
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      );
    }

    if (isMobile) {
      return (
        <div
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          className="group/sidebar-mobile absolute inset-0 z-40 flex"
        >
          {openMobile && (
            <div
              className="absolute inset-0 z-40 bg-black/80"
              onClick={() => setOpenMobile(false)}
            />
          )}
          <div
            data-slot="sidebar"
            data-mobile="true"
            data-state={openMobile ? "open" : "closed"}
            className={cn(
              "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-in-out group-data-[state=closed]/sidebar-mobile:-translate-x-full",
              openMobile && "translate-x-0",
              className,
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </div>
      );
    }

    return (
      <div
        data-slot="sidebar"
        data-state={state}
        data-collapsible={collapsible}
        className="group/sidebar relative h-screen bg-transparent transition-all duration-300 ease-in-out"
        ref={ref}
        {...props}
      >
        <div
          className={cn(
            "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out group-data-[state=collapsed]/sidebar:w-[--sidebar-width-icon]",
            className,
          )}
        >
          {children}
        </div>
      </div>
    );
  },
);
Sidebar.displayName = "Sidebar";

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      ref={ref}
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8", className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeftIcon className="size-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    data-slot="sidebar-rail"
    ref={ref}
    className={cn(
      "absolute inset-y-0 z-20 hidden w-1 bg-sidebar transition-colors hover:bg-sidebar-accent group-data-[side=left]/sidebar:-right-1 group-data-[side=right]/sidebar:-left-1 group-data-[state=collapsed]/sidebar:block",
      className,
    )}
    {...props}
  />
));
SidebarRail.displayName = "SidebarRail";

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <main
    data-slot="sidebar-inset"
    ref={ref}
    className={cn(
      "flex w-full flex-col bg-background transition-[margin,padding] duration-300 ease-in-out group-data-[state=collapsed]/sidebar:col-start-1 group-data-[state=collapsed]/sidebar:w-full group-data-[side=right]/sidebar:ml-0 group-data-[side=left]/sidebar:md:ml-auto group-data-[side=right]/sidebar:md:ml-0 lg:group-data-[state=collapsed]/sidebar:ml-[--sidebar-width-icon]",
      className,
    )}
    {...props}
  />
));
SidebarInset.displayName = "SidebarInset";

const sidebarMenuButtonVariants = cva(
  "peer/menu-button ring-offset-sidebar-background focus-visible:ring-ring/50 relative flex w-full items-center gap-2 overflow-hidden rounded-md px-2 py-1.5 text-left text-sm outline-none transition-[width,height,padding] focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:bg-sidebar-accent active:text-sidebar-accent-foreground data-[isactive]:bg-sidebar-accent data-[isactive]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]/sidebar:size-8 group-data-[collapsible=icon]/sidebar:p-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "border border-sidebar-border bg-white hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:border-sidebar-accent",
      },
      size: {
        default: "h-8 px-2",
        sm: "h-7 rounded-md px-2 text-xs",
        lg: "h-12 rounded-md px-4 text-sm group-data-[collapsible=icon]/sidebar:p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button"> &
    VariantProps<typeof sidebarMenuButtonVariants> & {
      asChild?: boolean;
      isActive?: boolean;
    }
>(
  (
    {
      variant = "default",
      size = "default",
      className,
      isActive = false,
      children,
      ...props
    },
    ref,
  ) => (
    <button
      data-slot="sidebar-menu-button"
      ref={ref}
      data-sidebar="menu-button"
      data-size={size}
      data-isactive={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  ),
);
SidebarMenuButton.displayName = "SidebarMenuButton";

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    data-slot="sidebar-menu"
    ref={ref}
    className={cn("flex w-full min-w-0 flex-col gap-1", className)}
    {...props}
  />
));
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li
    data-slot="sidebar-menu-item"
    ref={ref}
    className={cn("group/sidebar-menu-item relative", className)}
    {...props}
  />
));
SidebarMenuItem.displayName = "SidebarMenuItem";

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    showIcon?: boolean;
  }
>(({ className, showIcon = false, ...props }, ref) => (
  <div
    data-slot="sidebar-menu-skeleton"
    ref={ref}
    className={cn("space-y-2", className)}
    {...props}
  >
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="flex gap-2">
        {showIcon && <div className="bg-sidebar-accent size-4 rounded-md" />}
        <div className="bg-sidebar-accent h-4 w-full rounded-md" />
      </div>
    ))}
  </div>
));
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";

const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & {
    size?: "sm" | "md";
    isActive?: boolean;
  }
>(({ size = "md", isActive, className, ...props }, ref) => (
  <a
    data-slot="sidebar-menu-sub-button"
    ref={ref}
    data-sidebar="menu-sub-button"
    data-size={size}
    data-isactive={isActive}
    className={cn(
      "ring-offset-sidebar-background focus-visible:ring-ring/50 relative flex w-full items-center gap-1.5 overflow-hidden rounded-md px-2 py-1.5 text-sm text-sidebar-foreground/80 outline-none transition-all hover:bg-sidebar-accent hover:pr-[--trailing-padding] focus-visible:ring-2 focus-visible:ring-offset-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[isactive]:bg-sidebar-accent data-[isactive]:text-sidebar-accent-foreground [--trailing-padding:max(0px,_calc(var(--sidebar-width)_-_2rem))] group-data-[collapsible=icon]/sidebar:hidden",
      size === "sm" && "text-xs",
      size === "md" && "text-sm",
      className,
    )}
    {...props}
  />
));
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";

const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    data-slot="sidebar-menu-sub"
    ref={ref}
    className={cn(
      "space-y-1 border-l border-sidebar-border px-2 py-0.5 group-data-[collapsible=icon]/sidebar:hidden",
      className,
    )}
    {...props}
  />
));
SidebarMenuSub.displayName = "SidebarMenuSub";

const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ ...props }, ref) => (
  <li data-slot="sidebar-menu-sub-item" ref={ref} {...props} />
));
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";

const SidebarMenuBadge = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    data-slot="sidebar-menu-badge"
    ref={ref}
    className={cn(
      "ring-offset-sidebar-background ml-auto inline-flex h-5 items-center rounded-md border border-sidebar-border bg-sidebar px-1 text-xs font-medium text-sidebar-foreground transition-transform group-data-[collapsible=icon]/sidebar:opacity-0",
      className,
    )}
    {...props}
  />
));
SidebarMenuBadge.displayName = "SidebarMenuBadge";

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    data-slot="sidebar-footer"
    ref={ref}
    className={cn("mt-auto flex flex-col gap-2 p-4", className)}
    {...props}
  />
));
SidebarFooter.displayName = "SidebarFooter";

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    data-slot="sidebar-header"
    ref={ref}
    className={cn("flex flex-col gap-2 p-4", className)}
    {...props}
  />
));
SidebarHeader.displayName = "SidebarHeader";

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    data-slot="sidebar-content"
    ref={ref}
    className={cn(
      "flex flex-1 flex-col gap-0 overflow-auto px-4 group-data-[collapsible=icon]/sidebar:overflow-hidden group-data-[collapsible=icon]/sidebar:px-2",
      className,
    )}
    {...props}
  />
));
SidebarContent.displayName = "SidebarContent";

const SidebarSeparator = React.forwardRef<
  HTMLHRElement,
  React.HTMLAttributes<HTMLHRElement>
>(({ className, ...props }, ref) => (
  <hr
    data-slot="sidebar-separator"
    ref={ref}
    className={cn(
      "my-2 -mx-2 border-sidebar-border bg-sidebar-border/40 group-data-[collapsible=icon]/sidebar:my-2",
      className,
    )}
    {...props}
  />
));
SidebarSeparator.displayName = "SidebarSeparator";

const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button">
>(({ className, ...props }, ref) => (
  <button
    data-slot="sidebar-group-action"
    ref={ref}
    className={cn(
      "ring-offset-sidebar-background focus-visible:ring-ring/50 relative ml-auto inline-flex size-5 items-center justify-center rounded-md text-sidebar-foreground outline-none transition-transform hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-offset-2 [&>svg]:size-4",
      className,
    )}
    {...props}
  />
));
SidebarGroupAction.displayName = "SidebarGroupAction";

const sidebarGroupActionButtonVariants = cva(
  "ring-offset-sidebar-background focus-visible:ring-ring/50 relative h-7 w-7 rounded-md text-sidebar-foreground outline-none transition-transform focus-visible:ring-2 focus-visible:ring-offset-2 hover:text-sidebar-foreground [&>svg]:relative [&>svg]:size-4",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent",
        ghost: "hover:bg-transparent",
      },
      size: {
        default: "h-7 w-7 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const SidebarGroupLabel = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    data-slot="sidebar-group-label"
    ref={ref}
    className={cn(
      "display: block px-2 text-xs font-medium text-sidebar-foreground/70 transition-[margin,opa] duration-200 group-data-[collapsible=icon]/sidebar:px-0 group-data-[collapsible=icon]/sidebar:text-center group-data-[collapsible=icon]/sidebar:text-[0.5rem] group-data-[collapsible=icon]/sidebar:opacity-0",
      className,
    )}
    {...props}
  />
));
SidebarGroupLabel.displayName = "SidebarGroupLabel";

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    data-slot="sidebar-group"
    ref={ref}
    className={cn("relative flex w-full min-w-0 flex-col gap-2", className)}
    {...props}
  />
));
SidebarGroup.displayName = "SidebarGroup";

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
