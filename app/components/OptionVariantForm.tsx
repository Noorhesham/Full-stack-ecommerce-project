import React from "react";
import FormInput from "./InputField";
import { useFormContext } from "react-hook-form";
import { Delete } from "./Delete";
import BabySpinner from "./BabySpinner";
import { IoIosSave } from "react-icons/io";

const OptionVariantForm = ({name,label,fn,value,isPending}:{name:string,label:string,fn:any,value:any,isPending:boolean}) => {
    const {control}=useFormContext()
  return (
    <div className="flex w-full justify-between gap-3 items-center ">
      <FormInput control={control} className="w-full flex-auto" name={name} label={label} type="text" />

      <div className="flex items-center gap-2 flex-1">
        <Delete trigger={value ? true : false} value={value && value.name} onClick={fn} />
        <button className=" text-gray-700 hover:text-blue-400 duration-200 text-2xl" disabled={isPending} type="submit">
          {isPending ? <BabySpinner/> : <IoIosSave />}
        </button>
      </div>
    </div>
  );
};

export default OptionVariantForm;
