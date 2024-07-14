"use client";

import { useEffect, useState } from "react";

const ParaGraph = ({ desc }: { desc: string }) => {
  const [mount, setMount] = useState(false);
  useEffect(() => {
    setMount(true);
  }, []);
  return mount && <div dangerouslySetInnerHTML={{ __html: desc }} className="text-base my-auto" />;
};

export default ParaGraph;
