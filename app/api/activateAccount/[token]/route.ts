import Activation from "@/lib/database/models/ActivationModel";
import User from "@/lib/database/models/UserModel";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { token: string } }) {
  const { token } = params;
  const activation = await Activation.findOne({
    token,
    activatedAt: null,
    createdAt: { $gt: Date.now() - 24 * 60 * 60 * 1000 },
  });
  if (!activation) throw new Error("Invalid Token");
  activation.activatedAt = Date.now();
  const user = await User.findByIdAndUpdate(activation.user, {
    isActivated: true,
    activatedAt: Date.now(),
  });
  redirect("/signin");
}
