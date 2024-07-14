"use client";
import React, { useCallback, useEffect } from "react";
import { useGetCategories } from "../queries/queries";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Loader from "./Loader";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter, useSearchParams } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import { cn } from "../utils/cn";
import { Button } from "@/components/ui/button";
import debounce from "lodash.debounce";
import { motion } from "framer-motion";
const PRICE_FILTERS = [
  { value: [0, 10000], label: "Any Price", isCustom: false },
  { value: [1, 200], label: "Under 200$", isCustom: false },
  { value: [200, 1000], label: "Under 1000$", isCustom: false },
  { isCustom: true, value: [0, 10000] },
];
const DEFAULT_RANGE = [0, 10000];
const Filters = ({ onlyPrice = false }: { onlyPrice?: boolean }) => {
  const { categories, isLoading } = useGetCategories();
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = React.useState<string[]>([]);
  const [defaultOpen, setDefaultOpen] = React.useState<string[]>([]);
  const [priceFilter, setPriceFilter] = React.useState<{ range: number[]; isCustom: boolean }>({
    range: DEFAULT_RANGE,
    isCustom: false,
  });
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  useEffect(() => {
    const selectedSubcategories = searchParams.getAll("subcategories");
    const selectedCategories = searchParams.getAll("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    setSelectedCategories(selectedCategories);
    setSelectedSubcategories(selectedSubcategories);

    const openCategories = categories
      ?.filter(
        (category: any) =>
          selectedCategories.includes(category._id) ||
          category.subCategories.some((subCategory: any) => selectedSubcategories?.includes(subCategory._id))
      )
      .map((category: any) => category._id);

    setDefaultOpen(openCategories);
    let mathFound = false;
    if (!minPrice || !maxPrice) return setPriceFilter({ range: DEFAULT_RANGE, isCustom: false });
    PRICE_FILTERS.forEach((filter) => {
      if (filter.value[0] == parseInt(minPrice) && filter.value[1] == parseInt(maxPrice)) {
        setPriceFilter({ range: filter.value, isCustom: false });
        mathFound = true;
      }
    });
    if (!mathFound) setPriceFilter({ range: [parseInt(minPrice), parseInt(maxPrice)], isCustom: true });
  }, [categories, searchParams]);

  const updateUrl = (newSelectedCategories: string[], newSelectedSubcategories: string[]) => {
    const url = new URL(window.location.href);

    url.searchParams.delete("category");
    newSelectedCategories.forEach((cat) => url.searchParams.append("category", cat));

    url.searchParams.delete("subcategories");
    newSelectedSubcategories.forEach((sub) => url.searchParams.append("subcategories", sub));

    replace(url.toString(), { scroll: false });
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedSubcategories([]);
    setSelectedCategories((prev) => {
      const newSelectedCategories = prev.includes(categoryId)
        ? prev.filter((item) => item !== categoryId)
        : [...prev, categoryId];
      updateUrl(newSelectedCategories, []);
      return newSelectedCategories;
    });
  };

  const handleSubcategoryChange = (subcategoryId: string) => {
    setSelectedCategories([]);
    setSelectedSubcategories((prev) => {
      const newSelectedSubcategories = prev.includes(subcategoryId)
        ? prev.filter((item) => item !== subcategoryId)
        : [...prev, subcategoryId];
      updateUrl([], newSelectedSubcategories);
      return newSelectedSubcategories;
    });
  };
  const updatePriceUrl = (range: [number, number]) => {
    const url = new URL(window.location.href);
    url.searchParams.delete("minPrice");
    url.searchParams.delete("maxPrice");
    url.searchParams.append("minPrice", range[0].toString());
    url.searchParams.append("maxPrice", range[1].toString());
    replace(url.toString(), { scroll: false });
  };
  const debouncePriceChange = useCallback(
    debounce((range: [number, number]) => {
      updatePriceUrl(range);
    }, 500),
    []
  );
  const handlePriceChange = ({
    range,
    isCustom,
    debounce = false,
  }: {
    range: [number, number];
    isCustom: boolean;
    debounce?: boolean;
  }) => {
    const url = new URL(window.location.href);
    const [newMin, newMax] = range;
    setPriceFilter({ range: [newMin, newMax], isCustom });
    debounce ? debouncePriceChange(range) : updatePriceUrl(range);
    replace(url.toString(), { scroll: false });
  };
  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setPriceFilter({ range: DEFAULT_RANGE, isCustom: false });
    setDefaultOpen([]);
    updateUrl([], []);

    replace("/", { scroll: false });
  };

  if (isLoading) return <Loader />;
  const minPrice = Math.min(priceFilter.range[0], priceFilter.range[1]);
  const maxPrice = Math.max(priceFilter.range[0], priceFilter.range[1]);
  return (
    <motion.div initial={{ y: -100 }} animate={{ y: 1 }} className="   lg:block">
      {!onlyPrice && <span className="font-semibold mb-4 text-gray-800">Categories</span>}

      {
        <Accordion defaultValue={defaultOpen?.length > 0 ? [...defaultOpen, "price"] : ["price"]} type="multiple">
          {!onlyPrice &&
            categories.map((category: any) => (
              <AccordionItem key={category.id} value={category._id}>
                <AccordionTrigger className="text-sm font-medium text-gray-400 hover:text-gray-500 py-3">
                  <span className="font-medium text-gray-500">{category.name}</span>
                </AccordionTrigger>
                <AccordionContent className="pt-6">
                  <ul className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
                    <li className="flex items-center gap-2">
                      <Checkbox
                        id={category._id}
                        checked={selectedCategories.includes(category._id)}
                        onCheckedChange={() => handleCategoryChange(category._id)}
                      />
                      <label
                        htmlFor={category._id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        All for {category.name}
                      </label>
                    </li>
                    {category.subCategories.map((subCategory: any) => (
                      <li
                        key={subCategory.id}
                        className={`${
                          selectedSubcategories.includes(subCategory._id) ? "text-gray-500" : "text-gray-900"
                        } flex items-center gap-2`}
                      >
                        <Checkbox
                          id={subCategory._id}
                          checked={selectedSubcategories.includes(subCategory._id)}
                          onCheckedChange={() => handleSubcategoryChange(subCategory._id)}
                        />
                        <label
                          htmlFor={subCategory._id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {subCategory.name}
                        </label>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          <AccordionItem value={"price"}>
            <AccordionTrigger className="text-sm font-medium text-gray-400 hover:text-gray-500 py-3">
              <span className="font-medium text-gray-500">Price</span>
            </AccordionTrigger>
            <AccordionContent className="pt-6">
              <ul className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
                {PRICE_FILTERS.filter((p) => !p.isCustom).map((filter: any, i: number) => (
                  <li
                    key={i}
                    className={`${
                      priceFilter === filter.value ? "text-gray-500" : "text-gray-900"
                    } flex items-center gap-2`}
                  >
                    <input
                      type="radio"
                      id={filter.value}
                      checked={
                        priceFilter?.range?.[0] === filter.value?.[0] &&
                        priceFilter?.range?.[1] === filter.value?.[1] &&
                        !priceFilter?.isCustom
                      }
                      onChange={() => {
                        const url = new URL(window.location.href);
                        handlePriceChange({
                          range: filter.value,
                          isCustom: false,
                          debounce: false,
                        });
                        url.searchParams.delete("minPrice");
                        url.searchParams.delete("maxPrice");
                        url.searchParams.append("minPrice", filter.value[0].toString());
                        url.searchParams.append("maxPrice", filter.value[1].toString());
                        replace(url.toString(), { scroll: false });
                      }}
                    />
                    <label
                      htmlFor={filter.value}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {filter.label}
                    </label>
                  </li>
                ))}
                <li className="flex items-center   flex-col gap-4">
                  <div className="self-start flex items-center gap-2 mr-auto">
                    {" "}
                    <input
                      type="radio"
                      id={"price-custom"}
                      checked={priceFilter?.isCustom}
                      onChange={() => setPriceFilter({ isCustom: true, range: [0, 1000] })}
                    />
                    <label
                      htmlFor={"price-custom"}
                      className="text-sm  mr-auto font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Custom Price
                    </label>
                  </div>
                  {priceFilter && (
                    <div className="flex self-start w-full justify-between">
                      <p>Price</p>
                      <div>
                        {priceFilter?.isCustom ? minPrice.toFixed(0) : priceFilter?.range[0].toFixed(0)} $ -{" "}
                        {priceFilter?.isCustom ? maxPrice.toFixed(0) : priceFilter?.range[1].toFixed(0)} $
                      </div>
                    </div>
                  )}
                  <Slider
                    defaultValue={DEFAULT_RANGE}
                    min={DEFAULT_RANGE[0]}
                    max={DEFAULT_RANGE[1]}
                    step={20}
                    value={priceFilter?.isCustom ? priceFilter?.range : DEFAULT_RANGE}
                    onValueChange={(range) => {
                      const [newMin, newMax] = range;
                      handlePriceChange({ range: [newMin, newMax], isCustom: true, debounce: true });
                    }}
                    disabled={!priceFilter?.isCustom}
                    className={cn("w-full", !priceFilter?.isCustom && " opacity-50")}
                  />
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      }
      <Button
        variant="outline"
        size="sm"
        onClick={handleResetFilters}
        className="w-full mt-4"
        disabled={selectedCategories.length === 0 && selectedSubcategories.length === 0 && !priceFilter}
      >
        Reset Filters
      </Button>
    </motion.div>
  );
};

export default Filters;
