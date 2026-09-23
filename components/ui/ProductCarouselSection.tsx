import {
  CardFanCarousel,
  CardFanItem,
} from "@/components/ui/card-fan-carousel";

const productSlides: CardFanItem[] = [
  {
    id: "signature-piece-01",
    title: "Signature Piece 01",
    subtitle: "Crescent Collection",
    description: "Sculpted silver statement ring with architectural profile.",
    image: "/pdt/1000162280 (1).jpeg",
    badge: "Rings",
  },
  {
    id: "signature-piece-02",
    title: "Signature Piece 02",
    subtitle: "Velvet Atelier",
    description: "A refined contour pendant cut for luminous every-day wear.",
    image: "/pdt/1000162281.jpeg",
    badge: "Necklaces",
  },
  {
    id: "signature-piece-03",
    title: "Signature Piece 03",
    subtitle: "Luna Edit",
    description: "Minimal metalwork balancing polish, weight, and presence.",
    image: "/pdt/1000162282.jpeg",
    badge: "New",
  },
  {
    id: "signature-piece-04",
    title: "Signature Piece 04",
    subtitle: "Foundry No. 7",
    description: "Statement bridal accents finished in brilliant silver tones.",
    image: "/pdt/1000162283.jpeg",
    badge: "Bridal",
  },
  {
    id: "signature-piece-05",
    title: "Signature Piece 05",
    subtitle: "Form Study",
    description: "Curves and facets designed to hold the light with precision.",
    image: "/pdt/1000162284.jpeg",
    badge: "Featured",
  },
];

export default function ProductCarouselSection() {
  return (
    <section className="relative w-full bg-[#f3f3ee] py-16 md:py-20">
      <CardFanCarousel
        title="Selected Pieces"
        subtitle="atelier edit"
        items={productSlides}
      />
    </section>
  );
}
