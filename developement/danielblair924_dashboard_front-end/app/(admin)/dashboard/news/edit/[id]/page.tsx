import { EditPost } from "@/components/Dashboard/news/EditPost";
import BackButton from "@/components/reusable/BackButton";

interface EditNewsPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditNewsPage({ params }: EditNewsPageProps) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <BackButton />
        <h2 className="justify-start text-whiteColor text-2xl font-semibold leading-7">
          Edit Post
        </h2>
      </div>
      <div className="flex justify-center items-center">
        <EditPost postId={id} />
      </div>
    </div>
  );
}
