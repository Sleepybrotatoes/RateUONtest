import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, MessageSquare, Bookmark, Settings, Award, Calendar, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [forumPosts, setForumPosts] = useState<any[]>([]);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        setDisplayName(profileData.display_name || '');
        setBio(profileData.bio || '');
      }

      // Fetch user reviews
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select(`
          *,
          professors(name),
          courses(name, code)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      setReviews(reviewsData || []);

      // Fetch forum posts
      const { data: postsData } = await supabase
        .from('forum_posts')
        .select(`
          *,
          forum_threads(title)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      setForumPosts(postsData || []);

    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: displayName,
          bio: bio,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });

      fetchProfile();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <Layout>
        <div className="bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">Loading...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  const joinDate = profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown';
  const karmaPoints = profile?.karma_points || 0;

  return (
    <Layout>
      <div className="bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Profile Header */}
          <div className="mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile?.avatar_url} alt="" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold mb-2">
                      {profile?.display_name || 'User'}
                    </h1>
                    <p className="text-muted-foreground mb-2">{user.email}</p>
                    {profile?.bio && (
                      <p className="text-muted-foreground mb-4">{profile.bio}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">Joined {joinDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm">{karmaPoints} Karma Points</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        <span className="text-sm">{reviews.length} Reviews</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        <span className="text-sm">{forumPosts.length} Forum Posts</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Tabs */}
          <Tabs defaultValue="reviews" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="reviews">My Reviews</TabsTrigger>
              <TabsTrigger value="forum">Forum Activity</TabsTrigger>
              <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="reviews" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  {reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-l-2 border-primary pl-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.overall_rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <Badge variant="outline">
                              {review.reviewable_type === 'professor' && review.professors?.name}
                              {review.reviewable_type === 'course' && `${review.courses?.code} - ${review.courses?.name}`}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          {review.title && <h4 className="font-medium mb-1">{review.title}</h4>}
                          <p className="text-sm text-muted-foreground">{review.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No reviews yet. Start rating professors and courses!</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="forum" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Forum Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {forumPosts.length > 0 ? (
                    <div className="space-y-4">
                      {forumPosts.map((post) => (
                        <div key={post.id} className="border-l-2 border-primary pl-4">
                          <h4 className="font-medium mb-1">{post.forum_threads?.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {post.content.slice(0, 200)}...
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                            <span>{post.upvotes} upvotes</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No forum activity yet. Join the conversation!</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookmarks" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Bookmarks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Bookmark feature coming soon!</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter your display name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button onClick={updateProfile}>Save Changes</Button>
                    <Button variant="outline" onClick={handleSignOut}>
                      Sign Out
                    </Button>
                  </div>
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

export default Profile;