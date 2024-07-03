import React, { useState } from "react";
import { usePage } from "../context/PageContext";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

const ServerSearch = () => {
  const { handleSearch, query } = usePage();
  const [search, setSearch] = useState(query);

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      search && handleSearch(search);
    }
  };

  const handleClick = () => {
    search && handleSearch(search);
  };

  return (
    <div className="flex  w-full items-center gap-2">
      <Input
        placeholder="Search Products..."
        value={search}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        onKeyPress={handleKeyPress}
        className="max-w-md"
      />
      <SearchIcon onClick={handleClick} className="cursor-pointer" />
    </div>
  );
};

export default ServerSearch;
