import { getProduct } from "@/app/actions/products";
import AddToCart from "@/app/components/AddToCart";
import { BreadcrumbWithCustomSeparator } from "@/app/components/BreadCumber";
import ChooseVariants from "@/app/components/ChooseVariants";
import ImageSlider from "@/app/components/ImageSlider";
import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";
import ParaGraph from "@/app/components/ParaGraph";
import Price from "@/app/components/Price";
import ProductReel from "@/app/components/ProductReel";
import ReviewsSection from "@/app/components/ReviewsSection";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { convertToHTML } from "@/lib/utils";
import { Check, Shield, X } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
//by whom creator addtional infio ribbon  cvaruations
type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const id = params.id;
  const productData = await getProduct(id);
  if (!productData) return notFound();
  const { product } = productData;

  const imageUrl = product.images.length > 0 ? product.images[0].imgUrl : "/logo1.jpg"; // Ensure a default image is used if none exists
  const absoluteImageUrl = new URL(imageUrl, process.env.NEXTAUTH_URL).toString(); // Assuming you have NEXT_PUBLIC_SITE_URL set

  return {
    title: `Shinobi Store - ${product.name}`,
    openGraph: {
      title: `Shinobi Store - ${product.name}`,
      description: product.description,
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
  };
}
const page = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const id = params.id;
  const productData = await getProduct(id);
  const BREADCRUMBS = [
    {
      name: "Home",
      href: "/",
      id: 1,
    },
    {
      name: "Products",
      href: "/products",
      id: 2,
    },
  ];
  if (!productData) return notFound();
  const { product } = productData;

  const selectedVariantOptions = Object.keys(searchParams)
    .filter((key) => key.startsWith("option"))
    .map((key) => searchParams[key]);

  const getPriceForVariant = () => {
    let price = product.price;
    selectedVariantOptions.forEach((optionId) => {
      product.variations.forEach((variation: any) => {
        const option = variation.variationOptions.find((vo: any) => {
          return vo._id == optionId;
        });
        if (option) {
          price += typeof option.price === "number" ? option.price : Number(option.price.replace("$", "")) || 0;
        }
      });
    });
    return price;
  };
  const images = [
    ...product.images.map((image: any) => image.imgUrl),
    ...product.variations.flatMap((variation: any) =>
      variation.variationOptions.flatMap((option: any) =>
        option.images ? option.images.map((image: any) => image.imgUrl) : []
      )
    ),
  ];

  console.log(images);

  return (
    <MaxWidthWrapper>
      <div className=" bg-white ">
        <div className=" bg-white">
          <div className="mx-auto max-w-2xl px-4 py-16  sm:px-6 sm:py-24 lg:grid lg:grid-cols-2  lg:gap-x-8 lg:px-8  lg:max-w-7xl">
            <div className="lg:max-w-lg col-start-1 ">
              <BreadcrumbWithCustomSeparator breadcrumbs={BREADCRUMBS} />
              <div className=" mt-4">
                <h1 className="text-3xl  font-bold tracking-tight text-gray-900 sm:text-4xl">{product.name}</h1>
              </div>
              <section className="mt-4">
                <div className="flex items-start">
                  <Price
                    price={getPriceForVariant()}
                    isOnSale={product.isOnSale}
                    salePrice={parseFloat(product.salePrice.replace("$", ""))}
                  />
                  <div className="ml-4 rounded flex items-center border-l text-muted-foreground border-gray-300 pl-4">
                    <Link
                      href={`/products?category=${product.category.name}`}
                      className=" transition hover:text-orange-400  mb-auto self-start underline"
                    >
                      {product.category.name}
                    </Link>
                    {product.subCategories.length > 0 && (
                      <div className="flex gap-2 items-center ml-3">
                        :{" "}
                        {product.subCategories.map((subCategory: any) => (
                          <Link
                            href={`/products?category=${product.category.name}`}
                            key={subCategory.id}
                            className=" transition hover:text-orange-400  underline px-2 py-1 text-xs rounded-full text-gray-900 bg-gray-100 flex"
                          >
                            {subCategory.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center mt-6 gap-2">
                  <div className=" flex items-center">
                    <Check aria-hidden="true" className="h-5 w-5  flex-shrink-0 text-green-500" />
                    <p className=" ml-2  text-sm text-muted-foreground">Eligible for instant shipping</p>
                  </div>
                  <div className=" flex items-center">
                    {product.stock > 0 ? (
                      <Check aria-hidden="true" className="h-5 w-5  flex-shrink-0 text-green-500" />
                    ) : (
                      <X aria-hidden="true" className="h-5 w-5  flex-shrink-0 text-orange-500" />
                    )}
                    <p className=" ml-2  text-sm text-muted-foreground">
                      {product.stock > 0 ? "In stock" : "Out of stock"}
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-6">
                  <ParaGraph desc={convertToHTML(product.description)} />
                </div>
                <div className=" mt-10  lg:self-start col-start-1 lg:col-start-2 lg:max-w-lg">
                  <div>
                    <div className=" mt-auto">
                      <AddToCart
                        variantId={selectedVariantOptions}
                        price={getPriceForVariant()}
                        stock={product.stock}
                        btn
                        productId={product._id}
                      />
                    </div>
                    <div className=" mt-6 text-center">
                      <div className=" group inline-flex text-sm font-medium">
                        <Shield aria-hidden="true" className=" mr-2 h-5 w-5 flex-shrink-0 text-gray-400" />
                        <span className=" text-muted-foreground hover:text-gray-700">30-day money-back guarantee</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
            <div className="mt-10 flex flex-col gap-2  lg:mt-0 ">
              <div className=" aspect-square rounded-lg">
                <ImageSlider paginationImage={true} urls={images} />
              </div>
              <div className="flex  gap-2 justify-between flex-col">
                <h2 className="text-sm font-medium text-muted-foreground text-gray-900">Published By</h2>
                <Link href={`/profile/${product.creator._id}`} className="flex items-center gap-1">
                  <Avatar>
                    <AvatarImage src={`${product.creator.photo.imgUrl}` || "/avatar.jpg"} />
                    <AvatarFallback className=" bg-orange-300">{product.creator.firstName}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-sm items-start gap-1">
                    <h1 className="font-medium ml-1">{product.creator.firstName}</h1>
                  </div>
                </Link>
              </div>
              <div className="flex flex-col gap-2">
                {product.variations.length > 0 &&
                  product.variations.map(({ variation }: any, i: number) => (
                    <ChooseVariants product={product} i={i} key={i} variation={variation} />
                  ))}
              </div>
            </div>
          </div>
        </div>
        <div className=" w-full py-2 mt-2 px-4">
          <h1 className=" font-semibold text-3xl lg:text-4xl ">Product Specifications</h1>
          <div className=" mt-3 flex flex-col gap-2">
            {product.additionalInfo.map(({ title, description }: any, index: number) => (
              <div
                className=" py-2 px-4 flex items-center justify-between border-t border-b border-gray-300"
                key={index}
              >
                <h2 className="text-lg font-medium text-gray-900">{title}</h2>
                <ParaGraph desc={convertToHTML(description)} />
              </div>
            ))}
          </div>
        </div>
        <ReviewsSection reviews={product.reviews} productId={product._id} />
      </div>
      <ProductReel
        href={`/products?category=${product.category.name}`}
        filters={{ category: product.category._id, _id: { $ne: product._id }, status: "published" }}
        pageSize={5}
        subTitle={"Browse more like this"}
        title={`Similar ${product.category.name} Products `}
      />
    </MaxWidthWrapper>
  );
};

export default page;
