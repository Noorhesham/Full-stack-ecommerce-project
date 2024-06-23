"use client";
import React, { ReactNode, useState } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CategoriesField } from "./CategoriesField";
import { formatPrice } from "@/lib/utils";

const FormInput = ({
  control,
  name,
  label,
  type = "text",
  icon,
  phone,
  className,
  description,
  price,
  select,register,
  password = false, // Added password prop with default value false
}: {
  control: any;
  name: string;
  label: string;register?:any
  type?: string;
  phone?: boolean;
  description?: boolean;
  icon?: ReactNode;
  select?: boolean;
  price?: boolean;
  className?: string;
  password?: boolean; // Define password prop
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handlePriceChange = (value: string) => {
    const numberValue = parseFloat(value.replace(/[^0-9.-]+/g, ""));
    if (isNaN(numberValue)) return "";
    return formatPrice(numberValue.toFixed(3));
  };
  return (
    <>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex  flex-col text-left items-start  relative">
            <FormLabel
              className={`absolute z-20 transition-transform duration-300 ease-in-out ${
                isFocused || field.value
                  ? "top-0  text-seven-light transform left-0 -translate-y-6"
                  : "left-5 top-[24%]"
              }  ml-auto  text-sm flex items-center gap-2`}
            >
              {label} {icon}
              <span className="  font-normal text-red-600">*</span>
            </FormLabel>
            <div className={`relative  inline-flex items-center justify-center ${className}`}>
              <FormControl className={` body-2 ${password ? " pr-8" : "pr-5"}  pl-8 py-1 duration-200 `}>
                {phone ? (
                  <PhoneInput
                    {...field}
                    className="  w-full flex-row-reverse py-2 px-4 rounded-2xl gap-2"
                    international
                    defaultCountry="EG"
                    placeholder="Enter phone number"
                  />
                ) : description ? (
                  <textarea
                    {...field}
                    className=" border-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-gray-200 w-full flex-row-reverse py-2 px-4 rounded-2xl gap-2"
                  />
                ) : select ? (
                  <CategoriesField name="category" control={control} />
                ) : (
                  <Input
                    {...field}
                    type={password && !showPassword ? "password" : type} // Toggle input type based on password prop and showPassword state
                    className={` w-full`}
                    onFocus={() => setIsFocused(s=>s=true)}
                    value={field.value}
                    onBlur={() => {
                      if (!field.value) {
                        setIsFocused(false);
                      }
                    }}
                    onChange={(e) => {
                      field.onChange(price ? handlePriceChange(e.target.value) : e.target.value);
                      setIsFocused(s=>s=true)
                    }}
                  />
                )}
              </FormControl>
              {password && field.value && (
                <span
                  className=" absolute left-2  cursor-pointer hover:text-gray-900 text-gray-800"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeIcon className="w-4 h-4" /> : <EyeOffIcon className="w-4 h-4" />}
                </span>
              )}
            </div>
            <FormMessage className=" text-sm dark:text-red-500" />
          </FormItem>
        )}
      />
    </>
  );
};

export default FormInput;
