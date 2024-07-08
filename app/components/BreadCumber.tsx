"use client";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname, useRouter } from "next/navigation";

export function BreadcrumbWithCustomSeparator({ breadcrumbs }: { breadcrumbs?: any }) {
  const router = useRouter();
  const pathName = usePathname();
  const links: any = pathName.split("/");
  const arr = breadcrumbs || links;
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {arr.map((link: any, i: number) => {
          const isLast = i === links.length - 1;
          return (
            <>
              <BreadcrumbItem key={i}>
                {isLast ? (
                  <BreadcrumbPage>{link.name.split('').slice(0,20).join('') || link}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={`/${link.href || link}`}>{link.name.split('').slice(0,20).join('')||link}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
