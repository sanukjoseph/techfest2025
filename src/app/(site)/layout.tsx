import Footer from "@/components/home/Footer";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {children} <Footer />
    </div>
  );
}
