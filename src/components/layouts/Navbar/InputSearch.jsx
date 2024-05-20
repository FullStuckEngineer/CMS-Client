"use client";

import { MagnifyingGlass } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useRef } from "react";

const InputSearch = ({ className }) => {
  const searchRef = useRef();
  const router = useRouter();

  const handleSearch = (event) => {
    const keyword = searchRef.current.value.trim();

    if (!keyword || keyword.length < 3) return;

    if (event.key === "Enter" || event.type === "click") {
      event.preventDefault();
      router.push(`/search/${keyword}`);
    }
  };

  return (
    <div className="relative">
      <input
        placeholder="Cari di BabyBoo"
        className={`py-2 px-5 rounded-lg text-color-dark ${className}`}
        ref={searchRef}
        onKeyDown={handleSearch}
      />
      <button className="absolute bg-color-green hover:bg-color-greenhover py-[7px] px-[15px] top-[3.7px] end-1 rounded-md" onClick={handleSearch}>
        <MagnifyingGlass className="bg-transparent text-color-primary" size={20} />
      </button>
    </div>
  );
};

export default InputSearch;
