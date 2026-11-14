import { CreatePost } from "@/components/Dashboard/news/CreatePost";
import BackButton from "@/components/reusable/BackButton";

export default function CreatePostPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <BackButton />
        <h2 className="justify-start text-whiteColor text-2xl font-semibold leading-7">
          Create Post
        </h2>
      </div>
      <div className="flex justify-center items-center">
        <CreatePost />
      </div>
    </div>
  );
}
