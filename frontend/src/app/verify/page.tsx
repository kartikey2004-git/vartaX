import Loading from "@/components/Loading";
import VerifyOtp from "@/components/VerifyOtp";
import { Suspense } from "react";

const VerifyPage = () => {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <VerifyOtp />
      </Suspense>
    </div>
  );
};

export default VerifyPage;
