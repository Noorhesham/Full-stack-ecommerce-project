"use client";

const ParaGraph = ({ desc }: { desc: string }) => {
  return <div dangerouslySetInnerHTML={{ __html: desc }} className="text-base" />;
};

export default ParaGraph;
