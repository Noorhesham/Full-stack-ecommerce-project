"use client";
import React, { createContext, useContext } from "react";
interface PageContextProps {
  page: number ;
  query: string | undefined;
  filter: string | undefined;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  handleFilter: (f:string) => void;
  handleSearch: (q:string) => void;
}

const PageContext = createContext<PageContextProps>({} as PageContextProps);

export const PageProvider = ({ children,  }: { children: React.ReactNode; }) => {
  const [page, setPage] = React.useState(1);
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState("");
  const handleNextPage = () => {
    setPage(page + 1);
  };
  const handleFilter = (f:string) => {
    setPage(1);
    setFilter(f);
  }
  const handleSearch= (q:string) => {
    setPage(1);
    setQuery(q);
  }
  const handlePrevPage = () => {
    setPage(page - 1);
  };
 
  return (
    <PageContext.Provider
      value={{
        page,
        query,handleFilter,
        filter,
        handleNextPage,
        handlePrevPage,
        setPage,
        setQuery,
        setFilter,handleSearch
      }}
    >
      {children}
    </PageContext.Provider>
  );
};

export const usePage = () => useContext(PageContext);
