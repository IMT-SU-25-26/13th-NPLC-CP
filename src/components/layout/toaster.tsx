import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      theme="dark"
      richColors
      duration={5000}
      toastOptions={{
        classNames: {
          toast: "h-24 text-lg gap-4",
          title: "text-lg font-bold",
          description: "text-base",
          actionButton: "text-base",
          cancelButton: "text-base",
          icon: "size-8 flex-shrink-0",
        },
        style: {
          fontSize: "16px",
          padding: "20px",
          borderRadius: "8px",
          gap: "16px",
        },
      }}
    />
  );
}
