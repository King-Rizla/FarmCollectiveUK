import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  avatarUrl?: string;
}

interface StatProps {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface TestimonialsSectionProps {
  testimonials?: TestimonialProps[];
  stats?: StatProps[];
  title?: string;
  subtitle?: string;
}

const TestimonialsSection = ({
  testimonials = [
    {
      quote:
        "The Farm Collective has transformed how I source my weekly groceries. I know exactly where my food comes from and who grew it.",
      author: "Sarah Johnson",
      role: "Local Consumer",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    },
    {
      quote:
        "As a small-scale grower, this platform has connected me with customers I never would have reached otherwise. The reduced fees are a game-changer.",
      author: "Tom Williams",
      role: "Organic Farmer",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=tom",
    },
  ],
  stats = [
    {
      value: "£125,000+",
      label: "Saved in middleman fees",
    },
    {
      value: "78%",
      label: "Average fee reduction with tokens",
    },
    {
      value: "12km",
      label: "Average food travel distance",
    },
  ],
  title = "What Our Community Says",
  subtitle = "Join thousands of consumers and producers creating a more sustainable local food system",
}: TestimonialsSectionProps) => {
  return (
    <section className="w-full py-16 px-4 md:px-8 bg-amber-50 text-stone-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl md:text-4xl font-serif font-semibold mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {title}
          </motion.h2>
          <motion.p
            className="text-lg text-stone-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full bg-white border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex flex-col h-full">
                    <div className="mb-6">
                      <svg
                        className="h-8 w-8 text-green-600 mb-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                      <p className="text-lg italic">{testimonial.quote}</p>
                    </div>
                    <div className="mt-auto flex items-center">
                      <Avatar className="h-12 w-12 mr-4 border-2 border-green-100">
                        <AvatarImage
                          src={testimonial.avatarUrl}
                          alt={testimonial.author}
                        />
                        <AvatarFallback className="bg-green-100 text-green-800">
                          {testimonial.author
                            .split(" ")
                            .map((name) => name[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{testimonial.author}</h4>
                        <p className="text-sm text-stone-500">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="bg-green-800 text-white rounded-xl p-8 shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <p className="text-4xl font-bold mb-2 font-serif">
                  {stat.value}
                </p>
                <p className="text-green-100">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
