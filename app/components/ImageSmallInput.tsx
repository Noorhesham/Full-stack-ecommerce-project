import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import Image from "next/image";
import { TiDelete } from "react-icons/ti";
import { Progress } from "@/components/ui/progress";
import { deleteImage } from "../actions/products";
import { useDeleteImage } from "../queries/queries";
import { Delete } from "./Delete";
import Bin from "./Bin";

const ImageSmallInput = ({
  control,
  label,
  progress,
  name,
  defaultOption,
  deleteImage,
  args,
}: {
  control: any;
  label?: string;
  name: string;
  progress?: { [key: number]: number };
  defaultOption?: any;
  deleteImage: any;
  args: any;
}) => {
  const { setValue, getValues } = useFormContext(); //for the image file
  const { DeleteImage, isPending, isDeleted } = useDeleteImage();
  console.log(progress);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentFiles = getValues(name) || [];
    const newFiles = [...currentFiles, ...files].slice(0, 4); // Ensure maximum 4 files
    setValue(name, newFiles);
  };

  const removeFile = (index: number) => {
    const currentFiles = getValues(name) || [];
    const newFiles = currentFiles.filter((_: any, i: number) => i !== index);
    setValue(name, newFiles);
  };
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1 flex-col items-start flex gap-1">
          <FormLabel className="text-left text-sm">Images for {label}</FormLabel>
          <FormControl>
            <div className="flex flex-wrap gap-2">
              {(getValues(name) || []).map((file: any, index: number) => (
                <div
                  key={index}
                  className="relative rounded-lg hover:bg-rose-400/70 cursor-pointer duration-200 w-24 h-24"
                >
                  <Image
                    alt="upload"
                    src={file instanceof File ? URL.createObjectURL(file) : file.imgUrl}
                    fill
                    className="absolute rounded-lg object-cover"
                  />
                  <Delete value={'Image'}
                    btn={
                      <button disabled={isPending} type="button" className="absolute top-0 right-0  text-amber-400 hover:text-amber-700 duration-150 rounded-full p-1">
                        <Bin />
                      </button>
                    }
                    onClick={() => {
                      removeFile(index);
                      file.publicId && deleteImage({ ...args, publicId: file.publicId });
                    }}
                  />
                </div>
              ))}
              {progress && <Progress value={progress[0]} />}

              {(getValues(name) || []).length < 4 && (
                <div className="relative w-24 h-24 rounded-lg hover:bg-rose-400/70 cursor-pointer duration-200 border border-dashed flex items-center justify-center">
                  <Input
                    disabled={isPending}
                    type="file"
                    multiple
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  <span className="text-center">+</span>
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ImageSmallInput;
