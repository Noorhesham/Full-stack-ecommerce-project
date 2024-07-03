import React from 'react'
import FormInput from './InputField'
import { Button } from '@/components/ui/button'

const AddtionalInfoForm = ({index,control,remove,value,onChangetext,onChangedesc}:{index:number,control:any,remove:any,value?:any,onChangetext?:any,onChangedesc?:any}) => {
  return (
    <div className="flex mt-5 gap-6 flex-col ">
    <FormInput
      control={control}
      className="w-full"
      name={`additionalInfo.${index}.title`}
      label="Title"
      type="text" 
    />
    <FormInput
      control={control}
      className="w-full"
      description
      name={`additionalInfo.${index}.description`}
      label="Description"
      type="text" 
    />
    <Button className=" self-end" variant="destructive" onClick={() => remove(index)}>
      Remove
    </Button>
  </div>
  )
}

export default AddtionalInfoForm
