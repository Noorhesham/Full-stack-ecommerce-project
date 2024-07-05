import { getVariants } from "@/app/actions/products";
import LastFormProduct from "@/app/components/LastFormProduct";
import connect from "@/lib/database/connect";
const Notifications = require("@/lib/database/models/NotificationModel");
const page = async ({ params }: { params: { id: string } }) => {
  await connect();
  const variants = await getVariants();
  const notifications = await Notifications.find({ productId: params.id }).lean();
  const isNotified=notifications.length>0
  return <LastFormProduct isNotified={isNotified}  variations={variants} />;
};

export default page;
