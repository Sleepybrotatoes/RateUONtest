import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Edit, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Professor {
  id: string;
  name: string;
  title?: string;
  department?: string;
  email?: string;
  office_location?: string;
  bio?: string;
  avatar_url?: string;
  overall_rating: number;
  total_reviews: number;
}

export const ProfessorEditor = () => {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingProfessor, setEditingProfessor] = useState<Professor | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    department: "",
    email: "",
    office_location: "",
    bio: "",
    avatar_url: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchProfessors();
  }, []);

  const fetchProfessors = async () => {
    try {
      const { data, error } = await supabase
        .from('professors')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setProfessors(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load professors",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const professorData = {
        name: formData.name,
        title: formData.title || null,
        department: formData.department || null,
        email: formData.email || null,
        office_location: formData.office_location || null,
        bio: formData.bio || null,
        avatar_url: formData.avatar_url || null
      };

      if (editingProfessor) {
        const { error } = await supabase
          .from('professors')
          .update(professorData)
          .eq('id', editingProfessor.id);
        
        if (error) throw error;
        toast({ title: "Success", description: "Professor updated successfully" });
      } else {
        const { error } = await supabase
          .from('professors')
          .insert([professorData]);
        
        if (error) throw error;
        toast({ title: "Success", description: "Professor created successfully" });
      }

      resetForm();
      fetchProfessors();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save professor",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (professor: Professor) => {
    setEditingProfessor(professor);
    setFormData({
      name: professor.name,
      title: professor.title || "",
      department: professor.department || "",
      email: professor.email || "",
      office_location: professor.office_location || "",
      bio: professor.bio || "",
      avatar_url: professor.avatar_url || ""
    });
  };

  const handleDelete = async (professorId: string) => {
    if (!confirm("Are you sure you want to delete this professor?")) return;

    try {
      const { error } = await supabase
        .from('professors')
        .delete()
        .eq('id', professorId);
      
      if (error) throw error;
      toast({ title: "Success", description: "Professor deleted successfully" });
      fetchProfessors();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete professor",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setEditingProfessor(null);
    setFormData({
      name: "",
      title: "",
      department: "",
      email: "",
      office_location: "",
      bio: "",
      avatar_url: ""
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {editingProfessor ? "Edit Professor" : "Add New Professor"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Dr. John Smith"
                required
              />
            </div>

            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Associate Professor"
              />
            </div>

            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g., Computer Science"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g., john.smith@university.edu"
              />
            </div>

            <div>
              <Label htmlFor="office_location">Office Location</Label>
              <Input
                id="office_location"
                value={formData.office_location}
                onChange={(e) => setFormData({ ...formData, office_location: e.target.value })}
                placeholder="e.g., Building A, Room 101"
              />
            </div>

            <div>
              <Label htmlFor="avatar_url">Avatar URL</Label>
              <Input
                id="avatar_url"
                value={formData.avatar_url}
                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Professor's biography..."
                rows={3}
              />
            </div>

            <div className="md:col-span-2 flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : (editingProfessor ? "Update Professor" : "Add Professor")}
              </Button>
              {editingProfessor && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Professors</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {professors.map((professor) => (
                <TableRow key={professor.id}>
                  <TableCell className="font-medium">{professor.name}</TableCell>
                  <TableCell>{professor.title}</TableCell>
                  <TableCell>{professor.department}</TableCell>
                  <TableCell>{professor.email}</TableCell>
                  <TableCell>
                    {professor.overall_rating > 0 ? (
                      <span>{professor.overall_rating.toFixed(1)} ({professor.total_reviews})</span>
                    ) : (
                      <span className="text-muted-foreground">No reviews</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(professor)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(professor.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};