import ChallengeParticipantsTable from "@/components/Dashboard/challenges/ChallengeParticipantsTable";
import ChallengeRequirementsList from "@/components/Dashboard/challenges/ChallengeRequirementsList";

export default function ChallengeParticipantsPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="p-4 md:p-6 pb-2">
          <h3 className="text-base font-bold text-white tracking-wide">
            Participant Leaderboard
          </h3>
          <p className="text-xs text-descriptionColor mt-0.5">
            Ranked list of runners contributing mileage towards this challenge
          </p>
        </div>
        <ChallengeParticipantsTable />
      </div>

      <div className="border-t border-borderColor pt-4">
        <div className="px-4 md:px-6 pb-2">
          <h3 className="text-base font-bold text-white tracking-wide">
            Challenge Verification Rules
          </h3>
          <p className="text-xs text-descriptionColor mt-0.5">
            Active criteria and submission verification rules
          </p>
        </div>
        <ChallengeRequirementsList />
      </div>
    </div>
  );
}
