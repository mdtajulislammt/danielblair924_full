import EventRequirementsForm from "@/components/Dashboard/event/EventRequirementsForm";
import BackButton from "@/components/reusable/BackButton";

function page() {
  return (
    <div>
      <div className="mb-4">
        <BackButton />
      </div>
      <EventRequirementsForm />
    </div>
  );
}

export default page;
