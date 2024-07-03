
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonTable() {
  return Array.from({ length: 10 }).map((_, index) => (
   <table  key={index} >
     <tbody className="flex flex-col space-y-3">
      <tr>
        <td className="p-2">
          <Skeleton className="h-12 w-52" />
        </td>
        <td className="p-2">
          <Skeleton className="h-12 w-52" />
        </td>
        <td className="p-2">
          <Skeleton className="h-12 w-52" />
        </td>
        <td className="p-2">
          <Skeleton className="h-12 w-52" />
        </td>
        <td className="p-2">
          <Skeleton className="h-12 w-52" />
        </td>
        <td className="p-2">
          <Skeleton className="h-12 w-52" />
        </td>
        <td className="p-2">
          <Skeleton className="h-12 w-52" />
        </td>
      </tr>
    </tbody>
   </table>
  ));
}
