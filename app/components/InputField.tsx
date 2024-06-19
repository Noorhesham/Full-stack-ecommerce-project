"use client";
import React, { ReactNode, useState } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
const FormInput = ({
  control,
  name,
  label,
  type = "text",
  icon,
  phone,
  className,
  password = false, // Added password prop with default value false
}: {
  control: any;
  name: string;
  label: string;
  type?: string;
  phone?: boolean;
  icon?: ReactNode;
  className?: string;
  password?: boolean; // Define password prop
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex  flex-col items-end text-right relative">
            <FormLabel
              className={`absolute z-20 transition-transform duration-300 ease-in-out ${
                isFocused || field.value
                  ? "top-0  text-seven-light transform right-0 -translate-y-6"
                  : "right-5 top-[24%]"
              }  ml-auto text-right text-sm flex items-center gap-2`}
            >
              {label} {icon}
            </FormLabel>
            <div className={`relative  inline-flex items-center justify-center ${className}`}>
              <FormControl
                className={` body-2 ${password ? " pr-8" : "pr-5"} text-right pl-8 py-1 duration-200 `}
              >
                {phone ? (
                  <PhoneInput
                    {...field}
                    className="  w-full flex-row-reverse py-1 px-4 rounded-2xl gap-2"
                    international
                    defaultCountry="EG"
                    placeholder="Enter phone number"
                  />
                ) : (
                  <Input
                    {...field}
                    type={password && !showPassword ? "password" : "text"} // Toggle input type based on password prop and showPassword state
                    className={` w-full`}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => {
                      if (!field.value) {
                        setIsFocused(false);
                      }
                    }}
                  />
                )}
              </FormControl>
              {password && field.value && (
                <span
                  className=" absolute right-2  cursor-pointer hover:text-gray-900 text-gray-800"
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
