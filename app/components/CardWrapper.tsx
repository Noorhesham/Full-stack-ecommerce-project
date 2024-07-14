import React from "react";

const CardWrapper = ({
  children,
  text,
  paragraph,
  className,
  shadow = true,
}: {
  children: React.ReactNode;
  text: string;
  paragraph?: string;
  className?: string;
  shadow?: boolean;
}) => {
  return (
    <div className={`bg-white py-2 px-4 rounded-lg ${shadow ? "shadow-md" : ""} ${className || ""}`}>
      <div className="flex flex-col pt-3 items-start gap-2">
        <h1 className=" text-left  font-bold text-2xl text-gray-900">{text}</h1>
        {paragraph && <p className="text-gray-400 text-muted-foreground text-base">{paragraph}</p>}
      </div>
      <div className=" px-10 py-5">{children}</div>
    </div>
  );
};

export default CardWrapper;
