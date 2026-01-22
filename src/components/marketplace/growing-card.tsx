/**
 * Growing Card Component
 * Displays a pre-order product with share availability and ready date
 */

import React from "react";
import { Calendar, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Product } from "@/types/database";
import { PlantBadge } from "@/components/ui/plant-badge";

interface GrowingCardProps {
  product: Product;
  onReserve: (product: Product) => void;
  producerSalesCount?: number;
}

export function GrowingCard({ product, onReserve, producerSalesCount = 0 }: GrowingCardProps) {
  const totalShares = product.totalShares || 10;
  const reservedShares = product.reservedShares || 0;
  const availableShares = totalShares - reservedShares;
  const percentReserved = (reservedShares / totalShares) * 100;
  const isSoldOut = availableShares <= 0;

  const readyDate = product.readyDate
    ? new Date(product.readyDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "TBD";

  return (
    <Card className="overflow-hidden border-amber-200 hover:border-amber-300 transition-all hover:shadow-md">
      <div className="relative aspect-video overflow-hidden bg-amber-50">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2">
          <Badge className="bg-amber-600 text-white">
            <Calendar className="h-3 w-3 mr-1" />
            Ready: {readyDate}
          </Badge>
        </div>
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">Fully Reserved</span>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-green-800 text-lg">{product.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Avatar className="h-5 w-5">
                <AvatarImage src={product.producerAvatar} />
                <AvatarFallback className="text-xs">
                  {product.producerName?.[0] || "P"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-green-600">{product.producerName}</span>
              <PlantBadge salesCount={producerSalesCount} size="sm" />
            </div>
          </div>
          <div className="text-right">
            <span className="font-bold text-amber-700 text-lg">
              £{product.price.toFixed(2)}
            </span>
            <p className="text-xs text-gray-500">per share</p>
          </div>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {product.description}
        </p>

        {/* Share availability */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-green-700 flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {availableShares} of {totalShares} shares left
            </span>
            <span className="text-xs text-amber-600">{Math.round(percentReserved)}% reserved</span>
          </div>
          <Progress
            value={percentReserved}
            className="h-2 bg-green-100"
          />
        </div>

        <Button
          onClick={() => onReserve(product)}
          disabled={isSoldOut}
          className={cn(
            "w-full",
            isSoldOut
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-amber-600 hover:bg-amber-700"
          )}
        >
          {isSoldOut ? "Fully Reserved" : "Reserve Your Share"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default GrowingCard;
