import React from "react";
import { PageProvider } from "@/app/context/PageContext";
import ClientPage from "./ClientPage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const Page = async () => {
  const session = await getServerSession(authOptions);
  return (
    <PageProvider>
      <section className="container bg-white min-h-screen py-2">
        <ClientPage id={session?.user.id || ""} />
      </section>
    </PageProvider>
  );
};

export default Page;
