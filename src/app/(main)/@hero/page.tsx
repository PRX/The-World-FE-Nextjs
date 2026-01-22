import { getCachedHomepage } from "@/app/(main)/page";
import HeroEpisodesCarousel from "../_components/HeroEpisodesCarousel";

export default async function HomeHero() {
  const data = await getCachedHomepage();

  if (!data) return null;

  const { episodes } = data;

  return episodes && <HeroEpisodesCarousel episodes={episodes} />;
}
