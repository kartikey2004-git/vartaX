import Loading from "@/components/Loading";
import VerifyOtp from "@/components/VerifyOtp";
import { Suspense } from "react";

const VerifyPage = () => {
  return (
    <div>
      {/* Using Suspense to handle the loading state while VerifyOtp component is being loaded */}
      <Suspense fallback={<Loading />}>
        <VerifyOtp />
      </Suspense>
    </div>
  );
};

export default VerifyPage;
