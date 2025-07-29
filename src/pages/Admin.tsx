import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseEditor } from "@/components/admin/CourseEditor";
import { ProfessorEditor } from "@/components/admin/ProfessorEditor";
import { BuildingEditor } from "@/components/admin/BuildingEditor";
import { CafeEditor } from "@/components/admin/CafeEditor";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Admin = () => {
  const { user } = useAuth();
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRoles = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);
        
        if (error) throw error;
        setUserRoles(data?.map(r => r.role) || []);
      } catch (error) {
        console.error('Error fetching user roles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRoles();
  }, [user]);

  const hasRole = (role: string) => userRoles.includes(role);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div>Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please log in to access the admin panel.
            </AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }

  if (!hasRole('admin') && !hasRole('moderator')) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You don't have permission to access the admin panel.
            </AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">
            Manage courses, professors, buildings, and cafes
          </p>
        </div>

        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="professors">Professors</TabsTrigger>
            <TabsTrigger value="buildings">Buildings</TabsTrigger>
            <TabsTrigger value="cafes">Cafes</TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>Course Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CourseEditor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="professors">
            <Card>
              <CardHeader>
                <CardTitle>Professor Management</CardTitle>
              </CardHeader>
              <CardContent>
                <ProfessorEditor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="buildings">
            <Card>
              <CardHeader>
                <CardTitle>Building Management</CardTitle>
              </CardHeader>
              <CardContent>
                <BuildingEditor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cafes">
            <Card>
              <CardHeader>
                <CardTitle>Cafe Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CafeEditor />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;