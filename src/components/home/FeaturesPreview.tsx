import React from "react";
import { cn } from "@/lib/utils";
import { Leaf, Users, Award } from "lucide-react";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature = ({
  icon,
  title = "Feature Title",
  description = "Feature description goes here",
}: FeatureProps) => {
  return (
    <div className="flex flex-col items-center p-6 text-center bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="p-3 mb-4 rounded-full bg-green-50 text-green-700">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

interface FeaturesPreviewProps {
  features?: FeatureProps[];
}

const FeaturesPreview = ({ features }: FeaturesPreviewProps) => {
  const defaultFeatures = [
    {
      icon: <Leaf className="w-6 h-6" />,
      title: "Direct Trade",
      description:
        "Buy directly from local growers with zero middlemen, ensuring freshness and fair prices.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community",
      description:
        "Connect with local food producers and join a thriving network of sustainable food enthusiasts.",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Rewards",
      description:
        "Earn tokens with every purchase that can be redeemed for discounts and exclusive offers.",
    },
  ];

  const displayFeatures = features || defaultFeatures;

  return (
    <section className="py-16 px-4 bg-green-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Why Choose The Farm Collective?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform connects you directly with local food producers while
            building a sustainable community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayFeatures.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesPreview;
