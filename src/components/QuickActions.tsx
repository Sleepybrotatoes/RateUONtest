import { Plus, BookOpen, User, Building, Coffee, MessageSquare, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const QuickActions = () => {
  const actions = [
    {
      icon: Plus,
      title: "Write a Review",
      description: "Share your experience",
      color: "bg-green-500/20 text-green-400 border-green-500/30",
    },
    {
      icon: BookOpen,
      title: "Browse Courses",
      description: "Find your next class",
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    },
    {
      icon: User,
      title: "Find Professors",
      description: "Discover great educators",
      color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    },
      {
        icon: Building,
        title: "Rate Buildings",
        description: "Rate campus facilities",
        color: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      },
    {
      icon: Coffee,
      title: "Food & Dining",
      description: "Best eats on campus",
      color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    },
    {
      icon: MessageSquare,
      title: "Join Discussions",
      description: "Connect with students",
      color: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    },
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          What would you like to do?
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore campus life, share your experiences, and help fellow students make informed decisions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map((action, index) => {
          const getRoute = (title: string) => {
            switch(title) {
              case "Write a Review": return "/professors";
              case "Browse Courses": return "/courses";
              case "Find Professors": return "/professors";
              case "Rate Buildings": return "/buildings";
              case "Food & Dining": return "/buildings";
              case "Join Discussions": return "/forums";
              default: return "/";
            }
          };
          
          return (
            <Card 
              key={index} 
              className="bg-gradient-card border-border shadow-card hover:shadow-glow/50 transition-all duration-300 hover:scale-105 cursor-pointer group"
              onClick={() => window.location.href = getRoute(action.title)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg border ${action.color} group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground mb-1">{action.title}</h3>
                    <p className="text-muted-foreground text-sm">{action.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Campus Map CTA */}
      <div className="mt-12 text-center">
        <Card className="bg-gradient-card border-border shadow-card max-w-2xl mx-auto">
          <CardContent className="p-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-primary/20 text-primary border border-primary/30 p-4 rounded-lg">
                <MapPin className="h-8 w-8" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2 text-foreground">Explore Campus Map</h3>
            <p className="text-muted-foreground mb-6">
              Interactive map with ratings and reviews for every location on campus
            </p>
            <Button variant="hero" size="lg">
              View Campus Map
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuickActions;