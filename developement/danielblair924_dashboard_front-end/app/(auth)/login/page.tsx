import loginImg from "@/public/image/login.png";
import mainLogo from "@/public/image/mainLogo.png";
import Image from "next/image";
import LoginForm from "./_component/LoginForm";

function page() {
  return (
    <div className="h-screen relative">
      <Image
        src={loginImg}
        alt="Description"
        width={2500}
        height={2300}
        className="h-full w-full"
      />
      <div className=" absolute top-0 left-0 w-full h-full px-4  flex items-center justify-center">
        <div className="p-4 max-w-[440px] backdrop-blur-3xl shadow-[5px_0px_30px_5px_rgba(161,244,0,0.25)] bg-[#A1F400]/3 w-full border border-primaryColor md:p-8 md:py-12 rounded-lg">
          <div className="text-center">
            <Image
              src={mainLogo}
              alt="logo"
              width={200}
              height={200}
              className="mx-auto w-26 h-auto mb-6 lg:mb-8"
            />
            <h1 className="text-center text-2xl font-semibold text-white ">
              Admin Login
            </h1>
            <p className="text-descriptionColor text-base">
              Sign in to your admin panel
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default page;
