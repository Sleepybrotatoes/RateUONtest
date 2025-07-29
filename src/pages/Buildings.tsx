import { useState } from "react";
import { Search, MapPin, Wifi, Users, Accessibility, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Layout } from "@/components/Layout";
import Footer from "@/components/Footer";

const Buildings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const buildings = [
    {
      id: 1,
      name: "Engineering Building",
      code: "EA",
      type: "Academic",
      rating: 4.2,
      reviews: 89,
      location: "Callaghan Campus",
      facilities: {
        wifi: 4.5,
        cleanliness: 4.0,
        accessibility: 4.8,
        studySpaces: 3.8
      },
      tags: ["Computer Labs", "Study Rooms", "Lecture Theatres", "Accessible"],
      description: "Modern engineering building with state-of-the-art labs and facilities."
    },
    {
      id: 2,
      name: "Auchmuty Library",
      code: "AL",
      type: "Library",
      rating: 4.6,
      reviews: 234,
      location: "Callaghan Campus",
      facilities: {
        wifi: 4.8,
        cleanliness: 4.5,
        accessibility: 4.2,
        studySpaces: 4.9
      },
      tags: ["24/7 Access", "Silent Zones", "Group Study", "Research Resources"],
      description: "Main campus library with extensive study spaces and research facilities."
    },
    {
      id: 3,
      name: "Student Hub",
      code: "SH",
      type: "Student Services",
      rating: 4.1,
      reviews: 156,
      location: "Callaghan Campus",
      facilities: {
        wifi: 4.3,
        cleanliness: 4.2,
        accessibility: 4.6,
        studySpaces: 3.5
      },
      tags: ["Food Court", "Student Services", "Social Spaces", "ATM"],
      description: "Central hub for student services, dining, and social activities."
    },
  ];

  const filteredBuildings = buildings.filter(building =>
    building.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    building.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    building.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        <span className="text-lg font-semibold">{rating}</span>
        <span className="text-yellow-400">★</span>
      </div>
    );
  };

  return (
    <Layout>
      <div className="bg-background">
        <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            UON Buildings & Facilities
          </h1>
          <p className="text-muted-foreground text-lg">
            Rate and review campus buildings and facilities
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search buildings, codes, or facility types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Buildings Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBuildings.map((building) => (
            <Card key={building.id} className="hover:shadow-glow transition-all duration-300 cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <span>{building.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {building.code}
                      </Badge>
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {building.location}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    {renderRating(building.rating)}
                    <span className="text-xs text-muted-foreground">
                      {building.reviews} reviews
                    </span>
                  </div>
                </div>
                <Badge className="w-fit">{building.type}</Badge>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {building.description}
                  </p>
                  
                  {/* Facility Ratings */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Facilities Rating</h4>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Wifi className="h-4 w-4" />
                        <span className="text-sm flex-1">WiFi</span>
                        <span className="text-sm">{building.facilities.wifi}</span>
                      </div>
                      <Progress value={(building.facilities.wifi / 5) * 100} className="h-1" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span className="text-sm flex-1">Study Spaces</span>
                        <span className="text-sm">{building.facilities.studySpaces}</span>
                      </div>
                      <Progress value={(building.facilities.studySpaces / 5) * 100} className="h-1" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Accessibility className="h-4 w-4" />
                        <span className="text-sm flex-1">Accessibility</span>
                        <span className="text-sm">{building.facilities.accessibility}</span>
                      </div>
                      <Progress value={(building.facilities.accessibility / 5) * 100} className="h-1" />
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div>
                    <div className="flex flex-wrap gap-1">
                      {building.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {building.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{building.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button className="flex-1" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Rate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        </div>
        
        <Footer />
      </div>
    </Layout>
  );
};

export default Buildings;