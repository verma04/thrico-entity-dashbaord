"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Users, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

interface KycWelcomeProps {
  onStart: () => void;
}

const KycWelcome = ({ onStart }: KycWelcomeProps) => {
  const features = [
    {
      icon: <FileText className="h-10 w-10" />,
      title: "Content",
      description: "Where knowledge finds its voice",
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: "Community",
      description: "Stronger together in every way",
    },
    {
      icon: <ShoppingCart className="h-10 w-10" />,
      title: "Commerce",
      description: "Turn engagements into value",
    },
  ];

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] ">
      <div className="max-w-2xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Main Heading */}
          <div className="relative">
            <div className="">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Communities
                <br />
                start with people.
              </h1>
            </div>
           
          </div>

          {/* Subheading */}
          <p className="text-lg text-muted-foreground">
            We help you bring them together with
          </p>

          {/* Features Grid */}
          <div className="space-y-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-lg border bg-white/50 hover:bg-white/80 transition-colors"
              >
                <div className="flex-shrink-0 text-primary">{feature.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button size="lg" onClick={onStart} className="w-full sm:w-auto">
              Start Your Community
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default KycWelcome;
