"use client";
import { EmailIcon, PasswordIcon } from "@/public/demoData/Icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import { UserService } from "@/service/user/user.service";
import { CookieHelper } from "@/helper/cookie.helper";

interface LoginFormData {
  email: string;
  password: string;
}

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const route = useRouter();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const res: any = await UserService.login({
        email: data.email,
        password: data.password,
      });

      const resData = res?.data || res;
      const token =
        resData?.data?.accessToken ||
        resData?.accessToken ||
        res?.data?.accessToken;

      const refreshToken =
        resData?.data?.refreshToken ||
        resData?.refreshToken ||
        res?.data?.refreshToken;

      const user =
        resData?.data?.user ||
        resData?.user ||
        res?.data?.user;

      if (token) {
        CookieHelper.set({
          key: "token",
          value: token,
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
        CookieHelper.set({
          key: "accessToken",
          value: token,
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
        if (refreshToken) {
          CookieHelper.set({
            key: "refreshToken",
            value: refreshToken,
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });
        }
        if (user) {
          const userRole = user.role || "MEMBER";
          CookieHelper.set({ key: "role", value: userRole });
          CookieHelper.set({ key: "user", value: JSON.stringify(user) });
          if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("role", userRole);
          }
        }
        toast.success("Login successful! Redirecting to dashboard...");
        setTimeout(() => {
          route.push("/");
          route.refresh();
        }, 600);
      } else {
        toast.error("Login failed. No token received from server.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Invalid email or password. Please try again.";
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <ToastContainer theme="dark" position="top-right" autoClose={3000} />
      <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
        <div className="relative">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-white mb-2"
          >
            EMAIL ADDRESS
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            className="rounded-lg bg-bgColor border border-[#344217] pl-11 py-3.5 text-descriptionColor placeholder:text-descriptionColor px-4 w-full"
          />
          <div className="absolute left-3 top-1/2">
            <EmailIcon className="text-white" />
          </div>
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="relative">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-white mb-2"
          >
            PASSWORD
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="rounded-lg bg-bgColor border border-[#344217] pl-11 py-3.5 text-descriptionColor placeholder:text-descriptionColor px-4 w-full"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 active:scale-95 cursor-pointer -translate-y-1/2 text-primaryColor hover:text-primaryColor transition-colors"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye />}
            </button>
          </div>
          <div className="absolute left-3 top-1/2">
            <PasswordIcon className="text-white" />
          </div>
          {errors.password && (
            <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 mt-2 cursor-pointer hover:shadow-sm shadow-primaryColor disabled:bg-gray-500 disabled:text-gray-300 disabled:cursor-not-allowed rounded-full bg-primaryColor text-blackColor active:scale-95 font-medium hover:opacity-90 transition-opacity"
        >
          {isLoading ? "LOGGING IN..." : "LOG IN"}
        </button>
      </form>
      <div className="flex items-center justify-center">
        <Link
          href="/forgot-password"
          className="text-sm text-primaryColor hover:opacity-80 transition-opacity"
        >
          Forgot Password?
        </Link>
      </div>
    </div>
  );
}

export default LoginForm;
