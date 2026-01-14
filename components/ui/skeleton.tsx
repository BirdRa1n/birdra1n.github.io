import { Card, CardHeader, CardBody, Divider, Skeleton as HeroSkeleton } from "@heroui/react";

export const ProjectSkeleton = () => (
  <Card className="w-full h-[120px] border border-default-200" radius="md">
    <CardHeader className="flex flex-col gap-1 align-start items-start">
      <div className="flex gap-3 items-center w-full">
        <HeroSkeleton className="rounded-lg w-20 h-20" />
        <div className="flex flex-col gap-2 flex-1">
          <HeroSkeleton className="h-4 w-3/4 rounded-lg" />
          <HeroSkeleton className="h-3 w-full rounded-lg" />
        </div>
      </div>
    </CardHeader>
  </Card>
);

export const CertificateSkeleton = () => (
  <Card className="w-full h-[180px] border border-default-200 flex flex-col">
    <CardHeader className="flex gap-3 pb-3 flex-shrink-0">
      <HeroSkeleton className="rounded-lg w-12 h-12 flex-shrink-0" />
      <div className="flex flex-col gap-2 flex-1">
        <HeroSkeleton className="h-4 w-3/4 rounded-lg" />
        <HeroSkeleton className="h-3 w-1/2 rounded-lg" />
      </div>
      <HeroSkeleton className="rounded-lg w-4 h-4 flex-shrink-0" />
    </CardHeader>
    <Divider />
    <CardBody className="pt-3 flex-1 overflow-hidden">
      <div className="flex flex-wrap gap-1.5">
        <HeroSkeleton className="h-6 w-16 rounded-full" />
        <HeroSkeleton className="h-6 w-20 rounded-full" />
        <HeroSkeleton className="h-6 w-16 rounded-full" />
      </div>
    </CardBody>
  </Card>
);

export const RepoSkeleton = () => (
  <Card className="w-full h-[220px] border border-default-200 flex flex-col">
    <CardHeader className="flex gap-3 pb-3 flex-shrink-0">
      <HeroSkeleton className="rounded-lg w-12 h-12 flex-shrink-0" />
      <div className="flex flex-col gap-2 flex-1">
        <HeroSkeleton className="h-4 w-3/4 rounded-lg" />
        <HeroSkeleton className="h-3 w-1/2 rounded-lg" />
      </div>
    </CardHeader>
    <Divider />
    <CardBody className="pt-3 pb-3 flex-1 flex flex-col overflow-hidden">
      <HeroSkeleton className="h-4 w-full rounded-lg mb-2" />
      <HeroSkeleton className="h-4 w-5/6 rounded-lg mb-3" />
      <div className="flex flex-wrap gap-1.5 mt-auto">
        <HeroSkeleton className="h-6 w-16 rounded-full" />
        <HeroSkeleton className="h-6 w-20 rounded-full" />
      </div>
    </CardBody>
  </Card>
);
