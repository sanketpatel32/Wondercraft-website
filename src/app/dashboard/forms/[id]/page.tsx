import React from "react";
import { FormFiller } from "@/components/FormFiller";
import { DashboardHeader } from "@/components/DashboardHeader";
import { PageWrapper } from "@/components/PageWrapper";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { List } from "lucide-react";

export default async function DashboardFormPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <PageWrapper>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900 pb-5">
          <DashboardHeader title="Form Live Tester" subtitle="Verify visual parameters and validate rules inside the dashboard." />
          <Link href="/dashboard/forms" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full flex items-center justify-center gap-2 cursor-pointer">
              <List className="w-4 h-4" />
              Back to Forms
            </Button>
          </Link>
        </div>

        <div className="max-w-xl mx-auto w-full py-4">
          <FormFiller formId={id} isDashboard={true} />
        </div>
      </div>
    </PageWrapper>
  );
}
