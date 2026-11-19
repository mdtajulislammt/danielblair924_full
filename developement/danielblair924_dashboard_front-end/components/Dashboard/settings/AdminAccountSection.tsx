"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminAccountFormData, adminAccountSchema } from "./schemas";
import { SettingsService } from "@/service/settings/settings.service";
import { getErrorMessage } from "@/lib/apiResponse";
import { toast } from "react-toastify";

interface AdminAccountSectionProps {
  initialValues?: { name: string; email: string };
}

export const AdminAccountSection: React.FC<AdminAccountSectionProps> = ({
  initialValues,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AdminAccountFormData>({
    resolver: zodResolver(adminAccountSchema),
    defaultValues: {
      name: initialValues?.name || "",
      email: initialValues?.email || "",
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  useEffect(() => {
    if (!initialValues || !initialValues.name) {
      SettingsService.getAdminSettings()
        .then((res) => {
          if (res?.account) {
            reset({
              name: res.account.name || "",
              email: res.account.email || "",
              currentPassword: "",
              newPassword: "",
              confirmNewPassword: "",
            });
          }
        })
        .catch((err) => {
          console.warn("Could not fetch current admin settings:", err);
        });
    }
  }, [initialValues, reset]);

  const onSubmit = async (data: AdminAccountFormData) => {
    try {
      await SettingsService.updateAdminAccount({
        name: data.name,
        email: data.email,
        currentPassword: data.currentPassword || undefined,
        newPassword: data.newPassword || undefined,
        confirmNewPassword: data.confirmNewPassword || undefined,
      });

      toast.success("Admin account settings updated successfully!");
      setValue("currentPassword", "");
      setValue("newPassword", "");
      setValue("confirmNewPassword", "");
    } catch (err: any) {
      console.error("Failed to update admin account:", err);
      toast.error(getErrorMessage(err, "Failed to update account settings."));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex-1 p-6 bg-radial-[at_97%_0%] from-lime-900 to-stone-950 rounded-xl outline-1 outline-offset-[-1px] outline-lime-800 flex flex-col justify-start items-start gap-5"
    >
      {/* Account Details Heading */}
      <div className="w-full flex flex-col justify-start items-start">
        <h2 className="text-whiteColor text-xl font-bold leading-6">
          Admin Account
        </h2>
        <p className="text-xs text-stone-400 mt-1">
          Manage your administrator profile details and credentials.
        </p>
      </div>

      {/* Name and Email */}
      <div className="w-full flex flex-col sm:flex-row justify-start items-start gap-5">
        <div className="flex-1 w-full flex flex-col justify-start items-start gap-1.5">
          <label className="text-stone-300 text-sm font-semibold leading-5">
            Full Name
          </label>
          <input
            {...register("name")}
            placeholder="Admin Name"
            className="w-full h-11 px-3.5 bg-[#0D1402] rounded-lg outline-1 outline-offset-[-1px] outline-lime-900 focus:outline-primaryColor text-white text-sm font-normal leading-5 transition-colors"
          />
          {errors.name && (
            <span className="text-redColor text-xs">{errors.name.message}</span>
          )}
        </div>

        <div className="flex-1 w-full flex flex-col justify-start items-start gap-1.5">
          <label className="text-stone-300 text-sm font-semibold leading-5">
            Email Address
          </label>
          <input
            type="email"
            placeholder="admin@example.com"
            {...register("email")}
            className="w-full h-11 px-3.5 bg-[#0D1402] rounded-lg outline-1 outline-offset-[-1px] outline-lime-900 focus:outline-primaryColor text-white text-sm font-normal leading-5 transition-colors"
          />
          {errors.email && (
            <span className="text-redColor text-xs">{errors.email.message}</span>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-0 outline-1 outline-offset-[-0.50px] outline-lime-900/60 my-2" />

      {/* Change Password Heading */}
      <div className="w-full flex flex-col justify-start items-start">
        <h2 className="text-whiteColor text-xl font-bold leading-6">
          Change Password
        </h2>
        <p className="text-xs text-stone-400 mt-1">
          Leave blank if you do not wish to change your password.
        </p>
      </div>

      {/* Current & New Password */}
      <div className="w-full flex flex-col sm:flex-row justify-start items-start gap-5">
        <div className="flex-1 w-full flex flex-col justify-start items-start gap-1.5">
          <label className="text-stone-300 text-sm font-semibold leading-5">
            Current Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            {...register("currentPassword")}
            className="w-full h-11 px-3.5 bg-[#0D1402] rounded-lg outline-1 outline-offset-[-1px] outline-lime-900 focus:outline-primaryColor text-white text-sm font-normal leading-5 transition-colors"
          />
          {errors.currentPassword && (
            <span className="text-redColor text-xs">
              {errors.currentPassword.message}
            </span>
          )}
        </div>

        <div className="flex-1 w-full flex flex-col justify-start items-start gap-1.5">
          <label className="text-stone-300 text-sm font-semibold leading-5">
            New Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            {...register("newPassword")}
            className="w-full h-11 px-3.5 bg-[#0D1402] rounded-lg outline-1 outline-offset-[-1px] outline-lime-900 focus:outline-primaryColor text-white text-sm font-normal leading-5 transition-colors"
          />
          {errors.newPassword && (
            <span className="text-redColor text-xs">
              {errors.newPassword.message}
            </span>
          )}
        </div>
      </div>

      {/* Confirm Password */}
      <div className="w-full max-w-md flex flex-col justify-start items-start gap-1.5">
        <label className="text-stone-300 text-sm font-semibold leading-5">
          Confirm New Password
        </label>
        <input
          type="password"
          placeholder="••••••••"
          {...register("confirmNewPassword")}
          className="w-full h-11 px-3.5 bg-[#0D1402] rounded-lg outline-1 outline-offset-[-1px] outline-lime-900 focus:outline-primaryColor text-white text-sm font-normal leading-5 transition-colors"
        />
        {errors.confirmNewPassword && (
          <span className="text-redColor text-xs">
            {errors.confirmNewPassword.message}
          </span>
        )}
      </div>

      {/* Save Changes Button */}
      <div className="w-full flex justify-end items-center pt-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-10 px-8 bg-primaryColor hover:bg-lime-400 rounded-lg text-stone-950 text-sm font-bold leading-5 transition-colors cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? "Saving Changes..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};
export default AdminAccountSection;
