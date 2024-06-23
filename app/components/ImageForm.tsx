"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { motion } from "framer-motion";
import ImageInput from "./ImageInput";
import { toast } from "react-toastify";
import { useDeleteImage, useGetProduct, useUpdateImage } from "../queries/queries";
import { UploadImage } from "../actions/products";
import Loader from "./Loader";
import MiniSpinner from "./MiniSpinner";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import NextStep from "./NextStep";

const AddImagesForm = ({ productId }: { productId: string }) => {
  const { data, isLoading: isProductLoading, gotProduct } = useGetProduct(productId);
  const { DeleteImage, isPending, isDeleted } = useDeleteImage();
  const { updateUserImage, isPending: isPendingUpdate } = useUpdateImage();
  const [isLoading, setIsLoading] = useState<{ i: number; loading: boolean; progress?: number }[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [rejected, setRejected] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [isUploaded, setIsUploaded] = useState(false);
  const current_path = usePathname();
  const handleLoading = (index: number, loading: boolean, progress?: number) => {
    setIsLoading((prevState) => {
      const updatedState = [...prevState];
      updatedState[index] = { i: index, loading, progress };
      return updatedState;
    });
  };
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: File[]) => {
      console.log(acceptedFiles);
      acceptedFiles.forEach((file, i) => {
        setPreview((prevFiles) => [...prevFiles, URL.createObjectURL(file)]);
      });
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
      setRejected((prev) => [...prev, ...rejectedFiles]);
      setIsLoading((prevLoading) => [
        ...prevLoading,
        ...acceptedFiles.map((_, index) => ({ i: index + prevLoading.length, loading: false, progress: 0 })),
      ]);
    },
    [data]
  );

  const deleteImage = async (index: number) => {
    if (data?.product.images?.[index]) {
      handleLoading(index, true);
      setIsUploaded(false);
      DeleteImage({
        id: productId,
        url: data.product.images[index].imgUrl,
        publicId: data.product.images[index].publicId,
      });
    }
    setPreview((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    console.log(preview, files);
  };

  useEffect(() => {
    if (isDeleted) setIsLoading((prev) => [...prev].map((item) => ({ ...item, loading: false })));
    if (gotProduct) setPreview(data?.product.images?.map((i: any) => i.imgUrl) || []);
  }, [isDeleted, gotProduct, data]);

  const form = useForm();
  const { handleSubmit } = form;
  const querClient = useQueryClient();
  const num = preview.length - 1;
  const uploadImageWithProgress = async (file: File, index: number) => {
    return new Promise<void>((resolve, reject) => {
      const formData = new FormData();
      formData.append("upload_preset", "v7t8mt9o");
      formData.append("file", file);
      const config = {
        onUploadProgress: (progressEvent: any) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(preview, files);
          handleLoading(preview.length > files.length ? num : index, true, progress);
        },
      };

      axios
        .post(process.env.NEXT_PUBLIC_PUBLIC_CLOUDINARY_URL!, formData, config)
        .then(async (res) => {
          await UploadImage(res.data, productId);
          handleLoading(index, false);
          resolve();
          //@ts-ignore
          querClient.invalidateQueries([`product-${productId}`]);
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
          handleLoading(index, false);
          reject(new Error("Failed to upload image"));
        });
    });
  };

  const onSubmit = async () => {
    try {
      await Promise.all(files.map((file, index) => uploadImageWithProgress(file, index)));
      toast.success("Image uploaded successfully");
      setIsUploaded(true);
      setIsLoading([]);
      setFiles([]);
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Failed to upload images");
    }
  };

  return (
    <motion.div
      initial={{ x: 1000 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="container py-5 flex flex-col items-center justify-center lg:px-0"
    >
      <div className="flex flex-col px-20 py-8 xl:pb-[1.6rem] rounded-2xl bg-white items-center text-center">
        <div className="flex flex-col mb-4 mx-auto">
          <h1 className="text-2xl text-gray-900 font-bold mb-2 tracking-tight">Upload Your Images</h1>
          <p className="text-muted-foreground">
            Upload images describing your product. They must be optimized and high quality.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-[60vh] flex-col items-center">
            {isProductLoading ? (
              <Loader className="w-80 h-80" />
            ) : (
              <div className="px-3 py-1.5 mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }, (_, i) => (
                  <ImageInput
                    key={i}
                    id={productId}
                    updateImage={() =>
                      data?.product.images?.[i] &&
                      updateUserImage({ formData: files[i], id: productId, url: data.product.images[i] })
                    }
                    progress={isLoading[i]?.progress}
                    isLoading={isLoading[i]?.loading}
                    deleteImage={() => deleteImage(i)}
                    defaultImg={
                      (isUploaded && data?.product.images?.[i]?.imgUrl) || data?.product.images?.[i]?.imgUrl || ""
                    }
                    isPreview={preview[i] ? preview[i] : null}
                    onDrop={onDrop}
                  />
                ))}
              </div>
            )}
            <NextStep disabled={isLoading.some((load) => load.loading)} text="Submit" url="/last">
              {isLoading.some((load) => load.loading) && <MiniSpinner />}
            </NextStep>
          </form>
          {rejected.length > 0 &&
            rejected.map((file: any, index) => (
              <div key={index} className="text-center text-red-500">
                {file.errors?.[0]?.message || "Error uploading file"}
              </div>
            ))}
        </Form>
      </div>
    </motion.div>
  );
};

export default AddImagesForm;
