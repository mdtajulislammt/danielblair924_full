import ChallengeDetailsForm from "@/components/Dashboard/challenges/ChallengeDetailsForm";
import BackButton from "@/components/reusable/BackButton";

export default function CreateChallengePage() {
  return (
    <div>
      <div className="mb-4">
        <BackButton />
      </div>
      <ChallengeDetailsForm />
    </div>
  );
}
