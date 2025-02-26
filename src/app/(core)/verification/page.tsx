import { Suspense } from "react";
import { notFound } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VerificationForm from "@/components/dashboard/verification/verification-form";
import QRScanner from "@/components/dashboard/qr/qr-scanner";
import AttendeeCard from "@/components/dashboard/verification/attendee-card";
import { getData } from "@/actions/verification";

type VerificationProps = {
  searchParams: Promise<{ email?: string }>;
};

export default async function VerificationPage({ searchParams }: VerificationProps) {
  const { email } = await searchParams;

  return (
    <div className="container max-w-screen-sm mx-auto py-4">
      <h1 className="text-2xl font-bold mb-4">Attendee Verification</h1>
      {!email ? (
        <Tabs defaultValue="manual">
          <TabsList>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="qr">QR Scan</TabsTrigger>
          </TabsList>
          <TabsContent value="manual">
            <VerificationForm />
          </TabsContent>
          <TabsContent value="qr">
            <QRScanner />
          </TabsContent>
        </Tabs>
      ) : (
        <Suspense fallback={<VerificationSkeleton />}>
          <AttendeeData email={email} />
        </Suspense>
      )}
    </div>
  );
}

async function AttendeeData({ email }: { email: string }) {
  const data = await getData(email);
  if (!data?.id) {
    notFound();
  }
  return <Suspense fallback={<VerificationSkeleton />}>{data && <AttendeeCard attendee={data} />}</Suspense>;
}

function VerificationSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-2/3 mb-2" />
        <Skeleton className="h-4 w-1/3" />
      </CardContent>
    </Card>
  );
}
