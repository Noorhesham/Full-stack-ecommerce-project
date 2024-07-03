import ProductStep1Form from "@/app/components/ProductStarterForm";
import Steps from "@/app/components/Steps";

const page = async () => {
  return (
    <div className=" h-full">
      <Steps />
      <ProductStep1Form />
    </div>
  );
};

export default page;
