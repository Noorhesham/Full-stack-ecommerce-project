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

export function BreadcrumbWithCustomSeparator() {
  const router = useRouter();
  const pathName = usePathname();
  const links = pathName.split("/");
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {links.map((link: string, i: number) => {
          const isLast = i === links.length - 1;
          return (
            <>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{link}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={`/${link}`}>{link}</BreadcrumbLink>
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
