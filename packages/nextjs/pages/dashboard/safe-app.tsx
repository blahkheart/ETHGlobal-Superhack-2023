import { useEffect } from "react";
import { useRouter } from "next/router";
import SafeApps from "~~/components/superhack/SafeApps";
import { useAccountContext } from "~~/context/AccountContext";

// import { useAppStore } from "~~/services/store/store";

// const appUrl = "http://localhost:3001";

const SafeAppsPage = () => {
  const router = useRouter();

  // const walletAddress = useAppStore(state => state.walletAddress);
  const { activeTokenMainAccount } = useAccountContext();

  useEffect(() => {
    if (!activeTokenMainAccount) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTokenMainAccount]);

  return (
    <div className="">
      <SafeApps isWC={false} />
    </div>
  );
};

export default SafeAppsPage;
