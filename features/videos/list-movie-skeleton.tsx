import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";

export default function ListMovieSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, idx) => (
        <Card key={idx} className="overflow-hidden animate-pulse">
          <CardHeader className="p-0">
            <Skeleton className="w-full aspect-video" />
          </CardHeader>
          <CardBody>
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardBody>
          <CardFooter className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-24 rounded" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
