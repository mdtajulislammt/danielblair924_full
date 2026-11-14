import EventDetailsForm from "@/components/Dashboard/event/EventDetailsForm";
import BackButton from "@/components/reusable/BackButton";

export default function page() {
  return (
    <div>
      <div className="mb-4">
        <BackButton />
      </div>
      <div className="">
        <EventDetailsForm />
      </div>
    </div>
  );
}
