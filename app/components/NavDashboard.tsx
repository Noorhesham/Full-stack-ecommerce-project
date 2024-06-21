import React from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import User from "./User";
import { getServerSession } from "next-auth";

const NavDashboard = async () => {
  const session = await getServerSession();
  return (
    <MaxWidthWrapper>
      <div className=" border-b border-gray-200">
        <div className=" flex h-16 items-center">
          {/* <div className="hidden lg:ml-8 lg:block lg:self-stretch z-50">
       
        </div> */}
          <div className=" ml-auto flex items-center">
            <div className=" flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
              <User user={session?.user} />
            </div>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default NavDashboard;
