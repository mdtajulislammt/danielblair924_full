"use client";

import EventRequirementsForm from "@/components/Dashboard/event/EventRequirementsForm";
import BackButton from "@/components/reusable/BackButton";
import { useRouter } from "next/navigation";

export default function StepTwoPage() {
  const router = useRouter();

  const handlePublishSuccess = () => {
    router.push("/dashboard/challenges");
  };

  return (
    <div>
      <div className="mb-4">
        <BackButton />
      </div>
      <EventRequirementsForm onPublishSuccess={handlePublishSuccess} />
    </div>
  );
}
