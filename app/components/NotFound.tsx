import Image from "next/image";
import React from "react";

const NotFound = ({ label,text }: { label?: string,text?:string }) => {
  return (
    <div className="flex w-full col-span-4 m-auto justify-center items-center  flex-col">
      <div className=" h-60 w-60 aspect-square relative">
        <Image src={"/empty.jpg"} fill className="object-contain absolute inset-0" alt={"empty"} />
      </div>
      <p className="text-base text-muted-foreground mt-4">
       {text||'Sorry , we couldn&apos;t find what you were looking for.'}
      </p>
    </div>
  );
};

export default NotFound;
