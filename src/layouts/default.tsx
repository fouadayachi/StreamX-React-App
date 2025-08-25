import StreamingNavbar from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col min-h-screen bg-black text-white">
      <StreamingNavbar />

      {/* Full-width main area, children decide their own container */}
      <main className="flex-grow ">{children}</main>
    </div>
  );
}
