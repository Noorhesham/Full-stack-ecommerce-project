import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteImage as deleteImageApi,
  getCategories,
  getProduct,
  getVariants,
  updateImage,
} from "../actions/products";
import { toast } from "react-toastify";
import Product from "@/lib/database/models/ProductsModel";
import { updateCategory } from "../actions/categoryActions";

const useDeleteImage = () => {
  const querClient = useQueryClient();
  const {
    mutate: DeleteImage,
    isError,
    isPending,
    isSuccess: isDeleted,
  } = useMutation({
    mutationFn: async ({ id, url, publicId }: { id: string; url: string; publicId: string }) =>
      await deleteImageApi(id, url, publicId),
    onSuccess: (d) => {
      toast.success("Image deleted successfully");
      //@ts-ignore
      querClient.invalidateQueries(`product-${d.data.product._id}`);
    },
    onError: (err) => {
      console.log(err);
      toast.error("Error deleting image");
    },
  });
  return { DeleteImage, isError, isPending, isDeleted };
};
const useUpdateImage = () => {
  const {
    mutate: updateUserImage,
    isError,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: async ({ formData, id, url }: { formData: any; id: string; url: string }) =>
      await updateImage(formData, id, url),
    onSuccess: () => {
      toast.success("Image updated successfully");
    },
    onError: (err) => {
      console.log(err);
      toast.error("Error updating image");
    },
  });
  return { updateUserImage, isError, isPending, isSuccess };
};
const useGetProduct = (id: string) => {
  const {
    data,
    isLoading,
    isError,
    isSuccess: gotProduct,
  } = useQuery({
    queryKey: [`product-${id}`],
    queryFn: async () => await getProduct(id),
  });
  return { data, isLoading, gotProduct };
};
const useGetVariants = () => {
  const {
    data: variants,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [`variants`],
    queryFn: async () => await getVariants(),
  });
  return { variants, isLoading, isError };
};

const useGetCategories = () => {
  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [`categories`],
    queryFn: async () => await getCategories(),
  });
  return { categories, isLoading, isError };
};
const useUpdateCategories = () => {
  const querClient = useQueryClient();
  const {
    mutate: update,
    isPending,
    isError,
  } = useMutation({
    mutationFn: async ({ data, id }: { data: any; id?: string }) => {
      await updateCategory(data, id);
      //@ts-ignore
      querClient.invalidateQueries(["categories"]);
    },
    onSuccess: () => {
      toast.success(`Category added successfully`);
    },
    onError: (err: any) => {
      toast.error(err);
      console.log(err);
    },
  });

  return { update, isPending, isError };
};
export { useDeleteImage, useUpdateImage, useGetProduct, useGetVariants, useGetCategories, useUpdateCategories };
