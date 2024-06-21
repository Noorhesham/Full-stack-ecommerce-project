"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import ImageInput from "./ImageInput";
import { toast } from "react-toastify";
import { useDeleteImage, useGetProduct, useUpdateImage } from "../queries/queries";
import { UploadImage } from "../actions/products";
import Loader from "./Loader";
import MiniSpinner from "./MiniSpinner";

const AddImagesForm = ({ productId }: { productId: string }) => {
  const { DeleteImage, isPending ,isDeleted} = useDeleteImage();
  const { updateUserImage, isPending: isPendingUpdate } = useUpdateImage();
  const { data, isLoading: isProductLoading } = useGetProduct(productId);
  const [isLoading, setIsLoading] = useState<{ i: number; loading: boolean ,progress}[]>([{ i: 0, loading: false,progress:0 }]);
  const [files, setFiles] = useState<File[]>([]);
  const [rejected, setRejected] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [isUploaded, setIsUploaded] = useState(false);

  const handleLoading = (index: number, loading: boolean) => {
    setIsLoading((prevState) => {
      const updatedState = prevState.map((item) => (item.i === index ? { ...item, loading } : item));
      console.log("Updated state in setState:", updatedState); // Log the updated state within setState
      return updatedState;
    });
  };

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: File[]) => {
      acceptedFiles.forEach((file, i) => {
        if (data?.product.images?.[i]) {
          setPreview((prevFiles) => [
            //@ts-ignore
            ...new Set([...prevFiles, data?.product.images[i].imgUrl, URL.createObjectURL(file)]),
          ]);
        } else setPreview((prevFiles) => [...prevFiles, URL.createObjectURL(file)]);
      });
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
      setRejected((prev) => [...prev, ...rejectedFiles]);
    },
    [data]
  );
  const deleteImage = async (index: number) => {
    if (data?.product.images?.[index]) {
      handleLoading(index, true);
      setPreview((prevFiles) => prevFiles.filter((_, i) => i !== index));
      DeleteImage({
        id: productId,
        url: data.product.images[index].imgUrl,
        publicId: data.product.images[index].publicId,
      });
    } else {
      setPreview((prevFiles) => prevFiles.filter((_, i) => i !== index));
    }
  };
useEffect(() => {
  if(isDeleted) setIsLoading(prev=>[...prev].map(item=>({...item,loading:false})))
},[isDeleted])
  const form = useForm();
  const { handleSubmit } = form;
  const onSubmit = async () => {
    const formData = new FormData();
    formData.append("upload_preset", "v7t8mt9o");
    try {
      files.map(async (file, index) => {
        handleLoading(index, true);
        formData.append("file", file);
        await UploadImage(formData, productId,setIsLoading);
        handleLoading(index, false);
        setIsUploaded(true);
      });
    } catch (error: any) {
      console.error("Error uploading images:", error);
      toast.error("Failed to upload images");
    }
    toast.success("Image uploaded successfully");
 };
  return (
    <motion.div
      initial={{ x: 1000 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="container py-5 flex flex-col items-center justify-center lg:px-0"
    >
      <div className="flex flex-col px-20 py-8 xl:pb-[2.5rem] rounded-2xl bg-white items-center text-center">
        <div className="flex flex-col mb-4 mx-auto">
          <h1 className="text-2xl text-gray-900 font-bold mb-2 tracking-tight">Upload Your Images</h1>
          <p className="text-muted-foreground">
            Upload images describing your product. They must be optimized and high quality.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-[60vh] flex-col items-center">
            {isProductLoading ? (
              <Loader className="  w-80 h-80" />
            ) : (
              <div className=" px-3 py-1.5 mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }, (_, i) => 
                    <ImageInput
                      key={i}
                      id={productId}
                      updateImage={() =>
                        data?.product.images?.[i] &&
                        updateUserImage({ formData: files[i], id: productId, url: data.product.images[i] })
                      }
                      isLoading={isLoading[i]?.loading || isProductLoading}
                      deleteImage={() => deleteImage(i)}
                      //if the image exists, set the default image and delete will be to cloudinary and database not the state only
                      defaultImg={(isUploaded&&data?.product.images?.[i]?.imgUrl)||data?.product.images?.[i]?.imgUrl || ""}
                      // @ts-ignore
                      isPreview={preview[i] ? preview[i] : null}
                      onDrop={onDrop}
                    />
                  )}
                
              </div>
            )}
            <Button disabled={isLoading.some(({ loading }) => loading === true)} className="mt-5 relative w-[65%]">
              {isLoading.some(({ loading }) => loading === true) && <MiniSpinner />}
              Next
            </Button>
          </form>
          {rejected.length > 0 &&
            rejected.map((file, index) => (
              <div key={index} className="text-center text-red-500">
                {/* @ts-ignore */}
                {file.errors?.[0]?.message || "Error uploading file"}
              </div>
            ))}
        </Form>
      </div>
    </motion.div>
  );
};

export default AddImagesForm;
