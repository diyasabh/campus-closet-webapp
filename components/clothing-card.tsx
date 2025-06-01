import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { HeroButton } from "@/components/ui/hero-button";
import { useAuth } from "@/hooks/useAuth";
import { trackButtonClick } from "@/app/item/[id]/page";

interface ClothingItem {
  id: number;
  name: string;
  brand: string;
  size: string;
  price: number;
  deposit: number;
  image: string;
  owner: string;
  sold?: boolean; // optional for backward compatibility
}

interface ClothingCardProps {
  item: ClothingItem;
}



export default function ClothingCard({ item }: ClothingCardProps) {
  const { user } = useAuth();

  const handleViewDetailsClick = async () => {
    if (!user) return;
    await trackButtonClick(user.id, window.location.pathname, 'view_details_button', {
      itemId: item.id,
      itemName: item.name,
    });
  };

  return (
    <Card
      className={`overflow-hidden transition-all group border-black relative ${
        item.sold ? "opacity-60 grayscale" : ""
      }`}
    >
      <div className="aspect-[3/4] relative overflow-hidden">
        <img
          src={item.photo?.[0] || item.image || "/placeholder.svg"}
          alt={item.name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
        />
        <Badge variant="accent" className="absolute top-2 right-2">
          Size {item.size}
        </Badge>
        {item.sold && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded shadow z-10">
            RENTED OUT
          </span>
        )}
      </div>

      <CardContent className="pt-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-serif font-semibold text-lg text-black">
              {item.name}
            </h3>
            <p className="text-sm text-black">{item.brand}</p>
          </div>
          <div className="text-right">
            <p className="font-serif font-bold text-black">${item.fee}/day</p>
            <p className="text-xs text-black">${item.deposit} deposit</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Link href={`/item/${item.id}`} className="w-full">
          <HeroButton className="w-full" variant="default" size="sm" onClick={handleViewDetailsClick}>
            View Details
          </HeroButton>
        </Link>
      </CardFooter>
    </Card>
  );
}
