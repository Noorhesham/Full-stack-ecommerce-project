"use client";
import React, { ReactNode, useState } from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import { CommandBox } from "./CommandBox";
import RichText from "./RichText";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { BsCurrencyDollar } from "react-icons/bs";

const FormInput = ({
  control,
  onChange,
  value,
  optional = false,
  name,
  label,
  type = "text",
  icon,
  phone,
  className,
  description,
  price,
  select,
  register,
  switchToggle = false,
  desc,
  disabled,
  password = false, // Added password prop with default value false,
}: {
  control: any;
  onChange?: any;
  value?: any;
  name: string;
  switchToggle?: boolean;
  label: string;
  optional?: boolean;
  register?: any;
  type?: string;
  phone?: boolean;
  description?: boolean;
  icon?: ReactNode;
  select?: boolean;
  price?: boolean;
  desc?: string;
  className?: string;
  disabled?: boolean;
  password?: boolean; // Define password prop
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    console.log("Password visibility toggled", showPassword);
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
          <FormItem className={`flex w-full flex-col text-left items-start  relative`}>
            {!switchToggle && (
              <FormLabel
                className={`absolute z-10 transition-transform duration-300 ease-in-out ${
                  isFocused || field.value
                    ? "top-0  text-seven-light transform left-0 -translate-y-5"
                    : "left-5 top-[25%]"
                }  ml-auto  text-sm flex items-center gap-2`}
              >
                {label} {icon}
                {!optional && <span className="  font-normal text-red-600">*</span>}
              </FormLabel>
            )}
            <div className={`relative  inline-flex items-center justify-center ${className}`}>
              <FormControl
                className={` body-2 ${password ? " pr-8" : "pr-5"} ${switchToggle ? "" : " pl-8 py-1 duration-200"} `}
              >
                {phone ? (
                  <PhoneInput
                    disabled={disabled}
                    {...field}
                    className="  w-full flex-row-reverse py-2 px-4 rounded-2xl gap-2"
                    international
                    defaultCountry="EG"
                    placeholder="Enter phone number"
                  />
                ) : switchToggle ? (
                  <div className="flex gap-2 items-center ">
                    <Switch disabled={disabled} id="sale" checked={field.value} onCheckedChange={field.onChange} />
                    <Label htmlFor="sale">{label ? label : "On Sale"}</Label>
                  </div>
                ) : description ? (
                  <RichText description={value || field.value} onChange={onChange ? onChange : field.onChange} />
                ) : select ? (
                  <CommandBox name="category" control={control} />
                ) : (
                  <Input
                    disabled={disabled}
                    {...field}
                    type={password && !showPassword ? "password" : type === "password" ? "text" : type} // Toggle input type based on password prop and showPassword state
                    className={` w-full`}
                    onFocus={() => setIsFocused((s) => (s = true))}
                    value={value || field.value}
                    onBlur={() => {
                      if (!field.value) {
                        setIsFocused(false);
                      }
                    }}
                    onChange={(e) => {
                      if (onChange) return onChange(e);
                      field.onChange(e.target.value);
                      setIsFocused((s) => (s = true));
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
              {price && (
                <span className=" absolute left-2  cursor-pointer hover:text-gray-900 text-gray-800">
                  <BsCurrencyDollar className="w-4 h-4" />
                </span>
              )}
            </div>
            {desc && <FormDescription className=" text-sm text-muted-foreground">{desc}</FormDescription>}
            <FormMessage className=" text-sm dark:text-red-500" />
          </FormItem>
        )}
      />
    </>
  );
};

export default FormInput;
