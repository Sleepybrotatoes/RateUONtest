import { Search, BookOpen, User, Building, Coffee, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/campus-hero.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  
  const searchCategories = [
    { icon: User, label: "Professors", color: "bg-blue-500/20 text-blue-400" },
    { icon: BookOpen, label: "Courses", color: "bg-green-500/20 text-green-400" },
    { icon: Building, label: "Buildings", color: "bg-purple-500/20 text-purple-400" },
    { icon: Coffee, label: "Cafes", color: "bg-orange-500/20 text-orange-400" },
    { icon: Calendar, label: "Events", color: "bg-pink-500/20 text-pink-400" },
  ];

  return (
    <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90"></div>
        <div className="absolute inset-0 bg-gradient-hero"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
          Rate Everything at UON
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Discover the best professors, courses, study spots, and campus life through honest student reviews and community discussions.
        </p>

        {/* Main Search */}
        <div className="mb-8">
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search anything on campus..."
              className="pl-12 h-14 text-lg bg-card/80 backdrop-blur border-border shadow-card"
            />
            <Button variant="hero" size="lg" className="absolute right-2 top-1/2 transform -translate-y-1/2">
              Search
            </Button>
          </div>
        </div>

        {/* Quick Search Categories */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-3xl mx-auto">
          {searchCategories.map((category, index) => {
            const getRoute = (label: string) => {
              switch(label) {
                case "Professors": return "/professors";
                case "Courses": return "/courses";
                case "Buildings": return "/buildings";
                case "Events": return "/forums";
                default: return "/";
              }
            };
            
            return (
              <Card 
                key={index} 
                className="p-4 bg-card/60 backdrop-blur border-border hover:bg-card/80 transition-all duration-300 hover:scale-105 cursor-pointer group"
                onClick={() => navigate(getRoute(category.label))}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className={`p-3 rounded-full ${category.color} group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium text-card-foreground">{category.label}</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;