import { subCategoryProps } from "@/lib/database/models/SubCategory";

export interface CategoryProps {
  _id: string;
  name: string;
  subCategories: subCategoryProps[];
  id: string;
}
export interface ProductProps {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: CategoryProps;
  subCategories: subCategoryProps[];
  rating: number;
  published: boolean;
  numReviews: number;
  images: { publicId: string; imgUrl: string; secure_url: string; public_id: string }[];
  createdAt: string;
  stock: number | string;
  variations: VariationProps[];
  id?: string;
  step: number;
  additionalInfo?:
    | {
        title: string;
        description: string;
      }[]
    | [];
  isOnSale: boolean;
  salePrice?: string;
}
export interface variationOptionsProps {
  title: string;
  _id: string;
  image: string;
  variation?: string;
  price?: string;
  name?: string;
  variationOption: string;
}
export interface VariationProps {
  _id: string;
  variation: string;
  name: string;
  variationOptions: variationOptionsProps[];
  id: string;
  price: string;
  image: string[];
}
