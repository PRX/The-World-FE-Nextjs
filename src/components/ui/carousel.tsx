"use client";

import * as React from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { cn } from "@/lib/util/css";
import { Button } from "@/components/ui/button";
import MainUIContext from "@/app/(main)/_contexts/MainUIContext";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & CarouselProps) {
  const { isMenuExpanded, isMenuOpen } = React.useContext(MainUIContext);
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins,
  );
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext],
  );

  React.useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);

  React.useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);

    return () => {
      api?.off("select", onSelect);
    };
  }, [api, onSelect]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Need to react to UI changes.
  React.useEffect(() => {
    if (!api) return;
    setTimeout(() => {
      api.reInit();
    }, 800);
  }, [api, isMenuExpanded, isMenuOpen]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation:
          orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      {/** biome-ignore lint/a11y/useSemanticElements: Suggested change doesn't fix error. */}
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn("group/carousel relative", className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { carouselRef } = useCarousel();

  return (
    <div
      ref={carouselRef}
      className="overflow-hidden rounded-sm"
      data-slot="carousel-content"
    >
      <div
        className={cn(
          "flex",
          // orientation === "horizontal" ? "-ml-2" : "-mt-2 flex-col",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation } = useCarousel();

  return (
    // biome-ignore lint/a11y/useSemanticElements: Doesn't need to be a fieldset.
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        "group/carousel-item",
        "min-w-0 shrink-0 grow-0 basis-full",
        "p-2",
        {
          "last-of-type:mr-2": orientation === "horizontal",
        },
        className,
      )}
      {...props}
    />
  );
}

function CarouselPrevious({
  className,
  variant = "unstyled",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn(
        "absolute inset-0 z-1 grid items-center p-2 transition-opacity media-hover:opacity-0 cursor-pointer",
        "[&>svg]:size-18",
        orientation === "horizontal"
          ? "right-auto min-w-37 bg-linear-to-r from-50% from-navy-blue/70"
          : "bottom-auto min-h-37 [&>svg]:rotate-90",
        "hover:from-green/70",
        "focus-visible:opacity-100 focus-visible:outline-none focus-visible:from-cyan/70",
        "group-hover/carousel:not-disabled:opacity-100",
        "disabled:opacity-0 disabled:pointer-events-none",
        className,
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
}

function CarouselNext({
  className,
  variant = "unstyled",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn(
        "absolute inset-0 z-1 grid items-center justify-end p-2 transition-opacity media-hover:opacity-0 cursor-pointer",
        "[&>svg]:size-18",
        orientation === "horizontal"
          ? "left-auto w-37 bg-linear-to-l from-50% from-navy-blue/70"
          : "top-auto h-37 [&>svg]:rotate-90",
        "hover:from-purple/70",
        "focus-visible:opacity-100 focus-visible:outline-none focus-visible:from-cyan/70",
        "group-hover/carousel:not-disabled:opacity-100",
        "disabled:opacity-0 disabled:pointer-events-none",
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ChevronRightIcon />
      <span className="sr-only">Next slide</span>
    </Button>
  );
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};
