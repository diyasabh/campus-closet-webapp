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
  fee: number;
  deposit: number;
  photo: string[];
  owner: string;
  rental_status?: string;
  rental_end_date?: string;
}

interface ClothingCardProps {
  item: ClothingItem;
}

export default function ClothingCard({ item }: ClothingCardProps) {
  const { user } = useAuth();

  const handleViewDetailsClick = async () => {
    if (user) {
      await trackButtonClick(user.id, window.location.pathname, 'view_details_button', {
        item_id: item.id,
        item_name: item.name
      });
    }
  };

  const isRented = item.rental_status === 'rented';
  const rentedUntil = item.rental_end_date ? new Date(item.rental_end_date).toLocaleDateString() : null;

  return (
    <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
      <div className="relative">
        <img
          src={item.photo?.[0] || "/placeholder.svg"}
          alt={item.name}
          className={`w-full h-64 object-cover ${isRented ? 'opacity-75' : ''}`}
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-black text-white">
            SIZE {item.size}
          </Badge>
        </div>
        {isRented && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-red-600 text-white">
              RENTED
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-serif font-semibold text-lg text-black">
          {item.name}
        </h3>
        <p className="text-sm text-black">{item.brand}</p>
        {isRented && rentedUntil && (
          <p className="text-xs text-red-600 mt-1">
            Until {rentedUntil}
          </p>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <div className="w-full">
          <div className="text-right">
            <p className={`font-serif font-bold text-black ${isRented ? 'opacity-60' : ''}`}>
              ${item.fee}/day
            </p>
            <p className={`text-xs text-black ${isRented ? 'opacity-60' : ''}`}>
              ${item.deposit} deposit
            </p>
          </div>
          <Link href={`/item/${item.id}`} className="w-full">
            <HeroButton 
              className={`w-full ${isRented ? 'bg-gray-400 hover:bg-gray-400' : 'bg-[#8c1515] hover:bg-[#6f1111]'} text-white`}
              variant={isRented ? "secondary" : "default"}
              size="sm" 
              onClick={handleViewDetailsClick}
            >
              View Details
            </HeroButton>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}