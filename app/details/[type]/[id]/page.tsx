import DetailsContent from "@/components/DetailsContent";
import { getItemById } from "@/lib/serverData";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function DetailsPage({ params }: { params: Promise<{ type: string; id: string }> }) {
  const { type, id } = await params;
  const item = await getItemById(type, id);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Item not found</h1>
          <Link href="/" className="text-primary hover:underline">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <DetailsContent item={item} type={type} />
  );
}
