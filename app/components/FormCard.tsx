import React from "react";

const FormCard = ({ title, children, subTitle }: { title: string; subTitle: string; children: React.ReactNode }) => {
  return (
    <div className="  text-left shadow-md  border-b border-gray-500 flex flex-col gap-3  bg-white rounded-xl py-5 px-10">
      <h2 className="text-2xl font-semibold text-left p-3 border-b border-b-gray-400">{title}</h2>
      <p className=" leading-6 text-left font-thin pt-5">{subTitle}</p>
      {children}
    </div>
  );
};

export default FormCard;
