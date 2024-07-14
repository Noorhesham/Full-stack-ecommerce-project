"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { useProgress, Html, OrbitControls } from "@react-three/drei";
import Space from "./Space";
import Image from "next/image";

function Loader() {
  const { progress } = useProgress();

  return (
    <Html className="flex flex-col  py-2" center>
      <div className={`w-40 h-40 my-auto relative text-center  mx-auto `}>
        <Image src="/loader2.gif" fill alt="loader" className=" object-contain absolute" />
      </div>
      <span className="text-sm  text-gray-50 font-semibold  mt-2 text-muted-foreground  text-center">
        {progress.toFixed(1)} % Loading Your 3D Naruto{" "}
      </span>
    </Html>
  );
}

export default function ThreeDSpace({ className,path,sizes }: { className?: string ,path?:string,sizes?:[number,number,number]}) {
  return (
    <div className={className}>
      <Canvas className="w-full mb-20 h-full">
        <OrbitControls enablePan={true} enableZoom={false} enableRotate={true} />
        <Suspense fallback={<Loader />}>
          <directionalLight intensity={0.8} />
          <ambientLight intensity={0.3} />
          <pointLight intensity={0.8} />
          <hemisphereLight intensity={0.8} />
          <Space sizes={sizes} path={path}/>
        </Suspense>
      </Canvas>
    </div>
  );
}
