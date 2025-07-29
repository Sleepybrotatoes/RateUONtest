import { useState } from "react";
import { Search, Star, Users, BookOpen, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/Layout";
import Footer from "@/components/Footer";

const Professors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const professors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      department: "Computer Science",
      rating: 4.8,
      reviews: 127,
      courses: ["COMP2140", "COMP3320"],
      tags: ["Clear Explanations", "Helpful", "Fair Grader"],
      difficulty: 3.2
    },
    {
      id: 2,
      name: "Prof. Michael Chen",
      department: "Mathematics",
      rating: 4.3,
      reviews: 89,
      courses: ["MATH1110", "MATH2310"],
      tags: ["Challenging", "Knowledgeable", "Office Hours"],
      difficulty: 4.1
    },
    {
      id: 3,
      name: "Dr. Emily Watson",
      department: "Psychology",
      rating: 4.6,
      reviews: 156,
      courses: ["PSYC1010", "PSYC2250"],
      tags: ["Engaging", "Caring", "Good Feedback"],
      difficulty: 2.8
    },
  ];

  const filteredProfessors = professors.filter(prof =>
    prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prof.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prof.courses.some(course => course.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <Layout>
      <div className="bg-background">
        <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Rate UON Professors
          </h1>
          <p className="text-muted-foreground text-lg">
            Find and rate professors at University of Newcastle
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search professors, departments, or courses..."
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

        {/* Professors Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProfessors.map((professor) => (
            <Card key={professor.id} className="hover:shadow-glow transition-all duration-300 cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg">{professor.name}</span>
                  <div className="flex items-center gap-1">
                    {renderStars(professor.rating)}
                    <span className="ml-1 text-sm text-muted-foreground">
                      {professor.rating}
                    </span>
                  </div>
                </CardTitle>
                <p className="text-sm text-muted-foreground">{professor.department}</p>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{professor.reviews} reviews</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>Difficulty: {professor.difficulty}/5</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Courses:</p>
                    <div className="flex flex-wrap gap-1">
                      {professor.courses.map((course) => (
                        <Badge key={course} variant="secondary" className="text-xs">
                          {course}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Tags:</p>
                    <div className="flex flex-wrap gap-1">
                      {professor.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4">
                    View Profile & Reviews
                  </Button>
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

export default Professors;