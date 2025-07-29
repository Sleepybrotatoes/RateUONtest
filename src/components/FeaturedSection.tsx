import { Star, TrendingUp, MessageSquare, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const FeaturedSection = () => {
  const trendingProfessors = [
    {
      name: "Dr. Sarah Chen",
      department: "Computer Science",
      rating: 4.8,
      reviews: 156,
      tags: ["Clear Explanations", "Fair Grader"],
    },
    {
      name: "Prof. Michael Rodriguez",
      department: "Psychology",
      rating: 4.9,
      reviews: 203,
      tags: ["Engaging", "Extra Credit"],
    },
    {
      name: "Dr. Emily Watson",
      department: "Mathematics",
      rating: 4.6,
      reviews: 98,
      tags: ["Helpful", "Office Hours"],
    },
  ];

  const topCafes = [
    {
      name: "Central Library Café",
      rating: 4.7,
      category: "Coffee & Study",
      price: "$$",
      highlight: "Best Wi-Fi on campus",
    },
    {
      name: "Student Union Grill",
      rating: 4.5,
      category: "Quick Bites",
      price: "$",
      highlight: "Late night hours",
    },
    {
      name: "Engineering Lounge",
      rating: 4.8,
      category: "Coffee & Snacks",
      price: "$",
      highlight: "Quiet study atmosphere",
    },
  ];

  const hotTopics = [
    {
      title: "Best Study Spots for Finals Week",
      replies: 45,
      category: "Study Tips",
      timeAgo: "2h ago",
    },
    {
      title: "CHEM 201 with Prof. Johnson - Tips?",
      replies: 23,
      category: "Course Advice",
      timeAgo: "4h ago",
    },
    {
      title: "New Food Truck Near Library!",
      replies: 67,
      category: "Campus Life",
      timeAgo: "6h ago",
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : i < rating
            ? "text-yellow-400 fill-current opacity-50"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trending Professors */}
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Trending Professors</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {trendingProfessors.map((prof, index) => (
              <div key={index} className="p-4 bg-background/50 rounded-lg border border-border hover:bg-background/70 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-foreground">{prof.name}</h4>
                    <p className="text-sm text-muted-foreground">{prof.department}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {renderStars(prof.rating)}
                    <span className="text-sm ml-1">{prof.rating}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {prof.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">{prof.reviews} reviews</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Rated Cafes */}
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-400" />
              <span>Top Rated Cafes</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topCafes.map((cafe, index) => (
              <div key={index} className="p-4 bg-background/50 rounded-lg border border-border hover:bg-background/70 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-foreground">{cafe.name}</h4>
                    <p className="text-sm text-muted-foreground">{cafe.category} • {cafe.price}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {renderStars(cafe.rating)}
                    <span className="text-sm ml-1">{cafe.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-primary font-medium">{cafe.highlight}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Hot Forum Topics */}
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <span>Hot Forum Topics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {hotTopics.map((topic, index) => (
              <div key={index} className="p-4 bg-background/50 rounded-lg border border-border hover:bg-background/70 transition-colors cursor-pointer">
                <h4 className="font-semibold text-foreground mb-1">{topic.title}</h4>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline" className="text-xs">
                      {topic.category}
                    </Badge>
                    <span className="flex items-center space-x-1">
                      <MessageSquare className="h-3 w-3" />
                      <span>{topic.replies}</span>
                    </span>
                  </div>
                  <span className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{topic.timeAgo}</span>
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeaturedSection;