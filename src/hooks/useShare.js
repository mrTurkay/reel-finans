import { useCallback } from "react";
import html2canvas from "html2canvas";

export default function useShare(setToast) {
  const shareLink = useCallback(async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: "Reel Finans", url });
        return;
      } catch {
        /* user cancelled or share failed, fall through to clipboard */
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setToast("Link kopyalandı!");
    } catch {
      setToast("Link kopyalanamadı");
    }
  }, [setToast]);

  const shareImage = useCallback(
    async (ref) => {
      if (!ref.current) return;

      let canvas;
      try {
        canvas = await html2canvas(ref.current, {
          backgroundColor: "#0d1117",
          scale: 2,
        });
      } catch {
        setToast("Görsel oluşturulamadı");
        return;
      }

      const blob = await new Promise((res) =>
        canvas.toBlob(res, "image/png")
      );
      const file = new File([blob], "reel-finans.png", { type: "image/png" });

      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: "Reel Finans" });
          return;
        } catch {
          /* fall through to download */
        }
      }

      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "reel-finans.png";
      a.click();
      URL.revokeObjectURL(a.href);
      setToast("Görsel indirildi!");
    },
    [setToast]
  );

  return { shareLink, shareImage };
}
