import { useState, useEffect } from "react";
// import { Download } from 'lucide-react'

const PWADownloadBtn = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return ``;
    // @ts-ignore
    deferredPrompt.prompt();
    // @ts-ignore
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowButton(false);
    }
    setDeferredPrompt(null);
  };

  if (!showButton) return <></>;

  return (
    <div
      onClick={handleInstall}
      className="btn-secondary px-4 py-2 text-sm cursor-pointer"
    >
      Install App ✨
    </div>
  );
};

export default PWADownloadBtn;
