import { ColorPickerIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@optio/ui/components/breadcrumb";
import { Button } from "@optio/ui/components/button";
import { Separator } from "@optio/ui/components/separator";
import { SidebarTrigger } from "@optio/ui/components/sidebar";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";

export interface BreadcrumbCrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  crumbs: BreadcrumbCrumb[];
  action?: ReactNode;
  subheader?: ReactNode;
}

export function PageHeader({ crumbs, action, subheader }: PageHeaderProps) {
  return (
    <div className="sticky top-0 z-10 flex flex-col rounded-t-xl bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 lg:px-6">
        <Button asChild variant="secondary">
          <Link href="/" aria-label="Optio home">
            <HugeiconsIcon icon={ColorPickerIcon} strokeWidth={2} />
            optio
          </Link>
        </Button>
        <Separator orientation="vertical" className="mr-1 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {crumbs.map((crumb, idx) => {
              const isLast = idx === crumbs.length - 1;
              return (
                <Fragment key={`${crumb.label}-${idx}`}>
                  <BreadcrumbItem>
                    {isLast || !crumb.href ? (
                      <BreadcrumbPage className="max-w-[18rem] truncate">
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={crumb.href} className="max-w-[12rem] truncate">
                          {crumb.label}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
        {action ? <div className="ml-auto flex items-center gap-2">{action}</div> : null}
      </header>
      {subheader ? (
        <div className="flex min-h-16 items-center justify-between gap-4 border-b px-4 py-3 lg:px-6">
          {subheader}
        </div>
      ) : null}
    </div>
  );
}
