import MaxWidthWrapper from "../components/MaxWidthWrapper";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowDownToLineIcon, CheckCircle, Leaf } from "lucide-react";
import ProductReel from "../components/ProductReel";
import { HeroHighlightDemo } from "../components/HighLight";
import Filters from "../components/Filters";
import ThreeDSpace from "../components/ThreeDSpace";
const perks = [
  { name: "Instant Delivery", description: "Get your order in as fast as one hour !", icon: ArrowDownToLineIcon },
  {
    name: "Not happy?",
    description: "we offer free returns refund if you are not satisfied",
    icon: Leaf,
  },
  {
    name: "gauranteed quality",
    description: "every product is verified by our team to ensure our highest quality standards.",
    icon: CheckCircle,
  },
];
export default function Home({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const category = searchParams.category;
  const subCategories = searchParams.subcategories;
  const price = {
    min: searchParams.minPrice,
    max: searchParams.maxPrice,
  };
  //@ts-ignore
  const page = searchParams.page !== undefined ? parseInt(searchParams.page) : 1;
  const sort = searchParams.sort;
  const filters = { category, subCategories, price, status: "published" };
  return (
    <>
      <MaxWidthWrapper>
        <HeroHighlightDemo>
          <div className=" py-20 mx-auto  text-center flex flex-col items-center max-w-3xl">
            <h1 className="text-4xl font-bold capitalize tracking-tight text-gray-900 sm:text-6xl">
              Your market place for high quality{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-400">
                Online Products.
              </span>
            </h1>
            <p className=" mt-6 text-lg max-w-prose text-muted-foreground">
              Welcome to our store. Every product on out plattform is verified by our team to ensure our highest quality
              standards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Link className={buttonVariants()} href={"/products"}>
                Browse Trending
              </Link>
              <Button variant={"ghost"}>Our Quality Promise &rarr;</Button>
            </div>
          </div>
        </HeroHighlightDemo>
        <ProductReel
          filters={{ isFeatured: true }}
          title="Featured Products"
          subTitle="Our top selling products"
          href="/gaming"
          sort={""}
        />
        <section
          id="products"
          className="  grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 grid gap-4 py-5 mt-5"
        >
          <div className=" hidden lg:block">
            <Filters />
          </div>
          <div className=" ml-3 col-span-full lg:col-span-2 xl:col-span-3 ">
            <ProductReel
              filters={filters ? filters : null}
              className=" py-0"
              page={page}
              title="All Products"
              subTitle="Browse All products"
              sort={sort}
              paginate={true}
            />
          </div>
        </section>
      </MaxWidthWrapper>
      <section className=" border-t border-gray-200 bg-gray-50">
        <MaxWidthWrapper className=" py-20">
          <div className=" grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
            {perks.map((perk) => (
              <div key={perk.name} className="text-center md:flex md:items-start md:text-left lg:block lg:text-center">
                <div className="md:flex-shrink-0 flex  justify-center">
                  <div className="h-16 w-16 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-900">
                    {<perk.icon className=" w-1/3 h-1/3" />}
                  </div>
                </div>
                <div className=" mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6">
                  <h3 className=" text-base font-medium text-gray-900">{perk.name}</h3>
                  <p className=" mt-3 text-sm text-muted-foreground">{perk.description}</p>
                </div>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
        <div className="flex px-5 md:px-10  village backdrop-blur-lg  flex-col md:mb-20 md:flex-row items-center">
          <ThreeDSpace className="w-full md:w-1/2 lg:w-[80%] h-[400px] md:h-[500px]" />
          <div className="text-center mt-16 text-gray-100 md:text-left md:w-1/2 p-4">
            <h1 className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-400 font-bold">
              Why Shop at Shinobi Store?
            </h1>
            <p className="mt-4 text-gray-50 ">
              Ninja Store is your one-stop destination for high-quality, hand-picked products that are perfect for every
              occasion. Our dedicated team ensures that every item meets our rigorous standards of excellence, providing
              you with unparalleled quality and satisfaction. Whether you’re looking for the latest trends or timeless
              classics, we have it all. Our seamless shopping experience, coupled with our commitment to customer
              satisfaction, makes us the preferred choice for discerning shoppers. Discover the difference at Ninja
              Store – where quality and customer service are our top priorities.
            </p>
          </div>
        </div>
      
      </section>
    </>
  );
}
