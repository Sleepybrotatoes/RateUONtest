import { useState } from "react";
import { Search, MessageCircle, TrendingUp, Clock, Users, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout } from "@/components/Layout";
import Footer from "@/components/Footer";

const Forums = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const categories = [
    { name: "General Discussion", posts: 1247, color: "bg-blue-500/20 text-blue-400" },
    { name: "Course Help", posts: 892, color: "bg-green-500/20 text-green-400" },
    { name: "Study Groups", posts: 445, color: "bg-purple-500/20 text-purple-400" },
    { name: "Campus Life", posts: 623, color: "bg-orange-500/20 text-orange-400" },
    { name: "Marketplace", posts: 234, color: "bg-pink-500/20 text-pink-400" },
    { name: "Rants & Feedback", posts: 789, color: "bg-red-500/20 text-red-400" },
  ];

  const hotTopics = [
    {
      id: 1,
      title: "COMP2140 Assignment 2 Help Thread",
      author: "student123",
      category: "Course Help",
      replies: 47,
      views: 1284,
      timeAgo: "2 hours ago",
      lastActivity: "12 minutes ago",
      isPinned: true
    },
    {
      id: 2,
      title: "Best study spots on campus during exam period?",
      author: "studybuddy",
      category: "Campus Life",
      replies: 23,
      views: 892,
      timeAgo: "5 hours ago",
      lastActivity: "1 hour ago",
      isPinned: false
    },
    {
      id: 3,
      title: "Forming study group for MATH1110 final",
      author: "mathwhiz",
      category: "Study Groups",
      replies: 15,
      views: 445,
      timeAgo: "1 day ago",
      lastActivity: "3 hours ago",
      isPinned: false
    },
    {
      id: 4,
      title: "Selling textbooks - Engineering first year",
      author: "graduatingnow",
      category: "Marketplace",
      replies: 8,
      views: 267,
      timeAgo: "2 days ago",
      lastActivity: "6 hours ago",
      isPinned: false
    },
    {
      id: 5,
      title: "WiFi issues in Engineering Building EA?",
      author: "techstudent",
      category: "Rants & Feedback",
      replies: 31,
      views: 728,
      timeAgo: "3 days ago",
      lastActivity: "45 minutes ago",
      isPinned: false
    },
  ];

  const filteredTopics = hotTopics.filter(topic =>
    topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topic.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topic.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="bg-background">
        <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            UON Student Forums
          </h1>
          <p className="text-muted-foreground text-lg">
            Connect, discuss, and help each other succeed
          </p>
        </div>

        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse">Browse Forums</TabsTrigger>
            <TabsTrigger value="hot">Hot Topics</TabsTrigger>
            <TabsTrigger value="my-posts">My Posts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse">
            {/* Categories Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
              {categories.map((category, index) => (
                <Card key={index} className="hover:shadow-glow transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold mb-1">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {category.posts} posts
                        </p>
                      </div>
                      <div className={`p-3 rounded-full ${category.color} group-hover:scale-110 transition-transform duration-300`}>
                        <MessageCircle className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="hot">
            {/* Search and Actions */}
            <div className="mb-6 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Search topics, categories, or users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Topic
              </Button>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Hot Topics List */}
            <div className="space-y-4">
              {filteredTopics.map((topic) => (
                <Card key={topic.id} className="hover:shadow-glow transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {topic.isPinned && (
                            <Badge variant="secondary" className="text-xs">
                              Pinned
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {topic.category}
                          </Badge>
                        </div>
                        
                        <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors">
                          {topic.title}
                        </h3>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>by {topic.author}</span>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{topic.replies} replies</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{topic.views} views</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right text-sm text-muted-foreground">
                        <div className="flex items-center gap-1 mb-1">
                          <Clock className="h-4 w-4" />
                          <span>{topic.timeAgo}</span>
                        </div>
                        <div className="text-xs">
                          Last: {topic.lastActivity}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="my-posts">
            <Card>
              <CardContent className="p-8 text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                <p className="text-muted-foreground mb-4">
                  Sign in to view your posts and topics
                </p>
                <Button>Sign In</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
        
        <Footer />
      </div>
    </Layout>
  );
};

export default Forums;