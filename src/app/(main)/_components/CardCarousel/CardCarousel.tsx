"use client";

import { Carousel } from "@/components/ui/carousel";
import WheelGesturesPlugin from "embla-carousel-wheel-gestures";

export default function CardCarousel(
  props: React.ComponentProps<typeof Carousel>,
) {
  return <Carousel {...props} plugins={[WheelGesturesPlugin()]} />;
}
