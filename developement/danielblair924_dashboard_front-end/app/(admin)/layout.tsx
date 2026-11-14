import AdminMenu from "@/components/reusable/AdminMenu";
import Loader from "@/components/reusable/Loader";
import AuthGuard from "@/components/auth/AuthGuard";
import React, { Suspense } from "react";

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <Suspense fallback={<Loader />}>
        <AdminMenu>{children}</AdminMenu>
      </Suspense>
    </AuthGuard>
  );
}

export default AdminLayout;
