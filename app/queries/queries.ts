import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteImage as deleteImageApi,
  getCategories,
  getProduct,
  getProducts,
  getSubCategories,
  getVariants,
  updateImage,
} from "../actions/products";
import { toast } from "react-toastify";
import Product from "@/lib/database/models/ProductsModel";
import { deleteCategoryOrSub, updateCategoryOrSub } from "../actions/categoryActions";
import { useEffect } from "react";
import { addToCart, getCart, getProductByIdCart, removeFromCart } from "../actions/CartActions";

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
const useGetProducts = (page = 1, filters: {}) => {
  const queryClient = useQueryClient();
  console.log(filters);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", page, JSON.stringify(filters)],
    queryFn: async () => await getProducts(page, 10, filters),
  });

  useEffect(() => {
    // Prefetch the next two pages when the current page is loaded
    if (data && data.totalPages > page) {
      queryClient.prefetchQuery({
        queryKey: ["products", page + 1, JSON.stringify(filters)],
        queryFn: async () => await getProducts(page + 1, 10, filters),
      });

      if (data.totalPages > page + 1) {
        queryClient.prefetchQuery({
          queryKey: ["products", page + 2, JSON.stringify(filters)],
          queryFn: async () => await getProducts(page + 2, 10, filters),
        });
      }
    }
  }, [data, page, filters, queryClient]);

  return { data, isLoading, isError };
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

const useGetSubCategories = (id: string) => {
  console.log(id);
  const {
    data: Subcategories,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [`Subcategories${id}`],
    queryFn: async () => id && (await getSubCategories(id)),
  });
  return { Subcategories, isLoading, isError };
};
const useUpdateCategories = (sub = false, parent?: string) => {
  const queryClient = useQueryClient();
  const {
    mutate: update,
    isPending,
    isSuccess,
    data: newData,
  } = useMutation({
    mutationFn: async ({ data, id, remove = false }: { data: any; id?: string; remove?: boolean }) => {
      if (remove) {
        return await deleteCategoryOrSub(data, id, sub);
      } else {
        return await updateCategoryOrSub(data, id, sub);
      }
    },
    onSuccess: (response: any) => {
      console.log(response, sub);
      if (response?.success) {
        toast.success(response.success);
        //@ts-ignore
        queryClient.invalidateQueries("categories");
        //@ts-ignore
        if (sub) queryClient.invalidateQueries(`Subcategories${parent}`);
      } else {
        toast.error(response?.error || "An error occurred");
      }
    },
    onError: (err: any) => {
      toast.error(err.message || "An error occurred");
      console.log("onError:", err);
    },
  });

  return { update, isPending, isSuccess, newData };
};
const useGetCart = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [`cart`],
    queryFn: async () => await getCart(),
  });
  const cartItems = data?.cart?.map((c: any) => ({
    ...c.productId,
    variants: [...c.variants],
  }));
  return { cartItems, isLoading, isError };
};
const useUpdateCart = (toaster = true) => {
  const queryClient = useQueryClient();
  const {
    mutate: updateCart,
    isPending,
    isSuccess,
    data: newData,
  } = useMutation({
    mutationFn: async ({ data, remove }: { data: { productId: string; variantId?: string[] }; remove?: boolean }) =>
      remove ? removeFromCart(data.productId) : addToCart(data.productId, data.variantId),
    onSuccess: (response: any) => {
      if (response?.success) {
        if (toaster) toast.success(response.success);
        //@ts-ignore
        queryClient.invalidateQueries("cart");
      } else {
        toast.error(response?.error || "An error occurred");
      }
    },
    onError: (err: any) => {
      toast.error(err.message || "An error occurred");
      console.log("onError:", err);
    },
  });

  return { updateCart, isPending, isSuccess, newData };
};
const useGetProductCart = (id: string[]) => {
  const queryKey = id.filter((id) => id);
  const {
    data: cart,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [`cart ${queryKey}`],
    queryFn: async () => await Promise.all(id.map((id) => getProduct(id))),
  });
  return { cart, isLoading, isError };
};
export {
  useDeleteImage,
  useUpdateImage,
  useGetProduct,
  useGetVariants,
  useGetCategories,
  useUpdateCategories,
  useGetSubCategories,
  useGetProducts,
  useGetCart,
  useUpdateCart,
  useGetProductCart,
};
