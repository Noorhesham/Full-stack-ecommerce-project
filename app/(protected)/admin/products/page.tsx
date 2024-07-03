import React from "react";
import { PageProvider } from "@/app/context/PageContext";
import ClientPage from "./ClientPage";

const Page = () => {
  return (
    <PageProvider>
      <section className="container bg-white min-h-screen py-2">
        <ClientPage />
      </section>
    </PageProvider>
  );
};

export default Page;
// { searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }
// const page = parseInt(searchParams.page as string, 10) || 1;
// const search = (searchParams.search as string) || "";
// const category = (searchParams.filter as string) || "";
// const response = await getProducts(page, 20, { search, category });

// if (!response) {
//   return <div>Error fetching products</div>;
// }

// const { products, totalPages } = response;
