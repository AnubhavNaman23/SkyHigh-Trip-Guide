import HomeContent from "@/components/HomeContent";
import { getHomeData } from "@/lib/serverData";

export default async function Home() {
  const { hotels, flights } = await getHomeData();

  return (
    <HomeContent hotels={hotels} flights={flights} />
  );
}
