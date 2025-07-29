import { useState } from "react";
import { Search, Star, Clock, TrendingUp, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Layout } from "@/components/Layout";
import Footer from "@/components/Footer";

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const courses = [
    {
      id: 1,
      code: "COMP2140",
      name: "Software Engineering",
      professor: "Dr. Sarah Johnson",
      rating: 4.5,
      reviews: 98,
      difficulty: 3.8,
      workload: 4.2,
      usefulness: 4.7,
      credits: 10,
      semester: "Semester 1, 2024"
    },
    {
      id: 2,
      code: "MATH1110",
      name: "Mathematics for Engineers",
      professor: "Prof. Michael Chen",
      rating: 3.9,
      reviews: 145,
      difficulty: 4.5,
      workload: 4.1,
      usefulness: 4.0,
      credits: 10,
      semester: "Semester 1, 2024"
    },
    {
      id: 3,
      code: "PSYC1010",
      name: "Introduction to Psychology",
      professor: "Dr. Emily Watson",
      rating: 4.3,
      reviews: 203,
      difficulty: 2.1,
      workload: 2.8,
      usefulness: 3.8,
      credits: 10,
      semester: "Semester 1, 2024"
    },
  ];

  const filteredCourses = courses.filter(course =>
    course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.professor.toLowerCase().includes(searchTerm.toLowerCase())
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
            UON Course Reviews
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover and rate courses at University of Newcastle
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search courses, professors, or course codes..."
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

        {/* Courses Grid */}
        <div className="grid gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-glow transition-all duration-300 cursor-pointer">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-primary font-mono">{course.code}</span>
                      <span>-</span>
                      <span>{course.name}</span>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {course.professor} • {course.credits} units • {course.semester}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(course.rating)}
                    <span className="ml-2 text-lg font-semibold">{course.rating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({course.reviews} reviews)
                    </span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Rating Breakdown */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Rating Breakdown</h4>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Difficulty</span>
                        <span>{course.difficulty}/5</span>
                      </div>
                      <Progress value={(course.difficulty / 5) * 100} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Workload</span>
                        <span>{course.workload}/5</span>
                      </div>
                      <Progress value={(course.workload / 5) * 100} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Usefulness</span>
                        <span>{course.usefulness}/5</span>
                      </div>
                      <Progress value={(course.usefulness / 5) * 100} className="h-2" />
                    </div>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Quick Stats</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Average study time: 8-10 hrs/week</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        <span>Pass rate: 87%</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      <Badge variant="secondary">Group Work</Badge>
                      <Badge variant="secondary">Coding</Badge>
                      <Badge variant="secondary">Theory</Badge>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Actions</h4>
                    <div className="space-y-2">
                      <Button className="w-full" size="sm">
                        View Reviews
                      </Button>
                      <Button variant="outline" className="w-full" size="sm">
                        Write Review
                      </Button>
                      <Button variant="outline" className="w-full" size="sm">
                        View Professor
                      </Button>
                    </div>
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

export default Courses;