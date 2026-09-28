import SearchPageContent from "@/components/SearchPageContent";
import { getCategoryData } from "@/lib/serverData";

export const dynamic = 'force-dynamic';

export default async function SearchPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ category: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { category } = await params;
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const getParamValue = (param?: string | string[]) => Array.isArray(param) ? param[0] : param;
  const from = getParamValue(resolvedSearchParams.from);
  const to = getParamValue(resolvedSearchParams.to);
  const car = getParamValue(resolvedSearchParams.car);

  const { data, total } = await getCategoryData(category, page, 10, {
    from,
    to,
    car,
  });

  return (
    <SearchPageContent 
      category={category} 
      initialData={data} 
      totalItems={total}
    />
  );
}
