"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, ExternalLink } from "lucide-react";
import Image from "next/image";

const freeApps = [
  {
    id: "task-tracker",
    title: "Task Tracker",
    description: "Simple and effective task management tool for individuals and small teams",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop&q=60",
    features: [
      "Task organization",
      "Due date tracking",
      "Priority levels",
      "Progress monitoring"
    ]
  },
  {
    id: "code-snippet-manager",
    title: "Code Snippet Manager",
    description: "Store and organize your frequently used code snippets",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop&q=60",
    features: [
      "Syntax highlighting",
      "Tags and categories",
      "Search functionality",
      "Copy to clipboard"
    ]
  },
  {
    id: "time-tracker",
    title: "Time Tracker",
    description: "Track time spent on projects and tasks",
    image: "https://images.unsplash.com/photo-1508962914676-134849a727f0?w=800&auto=format&fit=crop&q=60",
    features: [
      "Project time tracking",
      "Activity logs",
      "Basic reporting",
      "Export data"
    ]
  }
];

export default function FreeApps() {
  return (
    <div className="min-h-screen py-10">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Free Applications</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our collection of free tools designed to help you be more productive. 
              No strings attached, just valuable resources for your success.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {freeApps.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
                      <Image
                        src={app.image}
                        alt={app.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardTitle>{app.title}</CardTitle>
                    <CardDescription>{app.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <h3 className="font-semibold mb-2">Key Features:</h3>
                    <ul className="space-y-2 mb-6">
                      {app.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-sm text-muted-foreground">
                          <span className="mr-2">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="flex gap-3 mt-auto">
                      <Button className="flex-1">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-4">Need More Features?</h2>
            <p className="text-muted-foreground mb-6">
              Check out our premium solutions for advanced features and professional support.
            </p>
            <Button size="lg" variant="outline" asChild>
              <a href="/store">Explore Premium Apps</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}