"use client";
import { buttonVariants } from "@/components/ui/button";
import { TbCameraPlus } from "react-icons/tb";
import React from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { FaCircleXmark } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { PinIcon } from "lucide-react";
import MiniSpinner from "./MiniSpinner";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const ImageInput = ({
  onDrop,
  isPreview,
  deleteImage,
  isLoading,
  defaultImg,
  id,
  updateImage,
  progress,
}: {
  onDrop: any;
  isPreview?: any;
  deleteImage?: any;
  isLoading?: any;
  defaultImg: any;
  id: string;
  updateImage: any;
  progress: any;
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "image/*": [] },
    maxSize: 3024 * 1000,
  });
  return (
    <div className="flex flex-col relative w-52 h-40 gap-4 rounded-2xl">
      {isPreview || defaultImg ? (
        <>
          <div className="flex hover:bg-rose-200 duration-200 h-full flex-col group cursor-pointer items-center gap-2 py-5 px-10 rounded-2xl">
            <Image
              src={isPreview || defaultImg}
              fill
              className={cn(
                "rounded-2xl hover:opacity-80 h-full duration-200 absolute object-contain",
                progress ? "opacity-40" : ""
              )}
              alt="upload"
            />
            {isLoading && progress ? (
              <CircularProgressbar
                styles={{ path: { stroke: "#F43F5E", color: "#F43F5E", backgroundColor: "#F43F5E", fill: "#F43F5E" } }}
                className="z-20 text-red-500"
                text={`${progress}%`}
                value={progress}
              />
            ) : (
              ""
            )}
            {isLoading && !progress && <MiniSpinner />}
            <span
              onClick={(e) => deleteImage()}
              className="absolute text-red-500 hover:text-red-300 duration-200 top-2 z-50 text-2xl right-3 text-center font-semibold hidden group-hover:flex items-center gap-2"
            >
              <FaCircleXmark />
            </span>
            {defaultImg && (
              <span>
                <PinIcon
                  onClick={updateImage}
                  className="absolute text-green-500 hover:text-green-300 duration-200 top-2 z-50 text-2xl right-3 text-center font-semibold flex group-hover:hidden items-center gap-2"
                />
              </span>
            )}
          </div>
        </>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "flex flex-col group cursor-pointer h-full items-center gap-2 py-5 px-10 rounded-2xl border-dashed border-gray-500 border-2",
            isDragActive ? "bg-rose-200" : ""
          )}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <div className="flex text-red-500 flex-col items-center">
              <span>Choose a file or drag & drop it here</span>
              <span>Jepg or png</span>
            </div>
          ) : (
            <>
              <TbCameraPlus className="text-4xl group-hover:text-red-500 duration-200" />
              <span
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "group-hover:text-red-500 duration-200 rounded-full mt-4"
                )}
              >
                Upload
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageInput;
