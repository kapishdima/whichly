import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@optio/ui/components/breadcrumb";
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
  subheader?: ReactNode;
}

export function PageHeader({ crumbs, subheader }: PageHeaderProps) {
  return (
    <div className="sticky top-0 z-10 flex flex-col bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 lg:px-6">
        <SidebarTrigger className="-ml-1" />
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
      </header>
      {subheader ? (
        <div className="flex min-h-16 items-center justify-between gap-4 border-b px-4 py-3 lg:px-6">
          {subheader}
        </div>
      ) : null}
    </div>
  );
}
