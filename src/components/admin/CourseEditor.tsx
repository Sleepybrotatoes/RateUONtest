import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: string;
  code: string;
  name: string;
  description?: string;
  department?: string;
  level?: string;
  credits?: number;
  prerequisites?: string[];
  overall_rating: number;
  total_reviews: number;
}

export const CourseEditor = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    department: "",
    level: "",
    credits: "",
    prerequisites: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('code');
      
      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const courseData = {
        code: formData.code,
        name: formData.name,
        description: formData.description || null,
        department: formData.department || null,
        level: formData.level || null,
        credits: formData.credits ? parseInt(formData.credits) : null,
        prerequisites: formData.prerequisites ? formData.prerequisites.split(',').map(p => p.trim()) : null
      };

      if (editingCourse) {
        const { error } = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', editingCourse.id);
        
        if (error) throw error;
        toast({ title: "Success", description: "Course updated successfully" });
      } else {
        const { error } = await supabase
          .from('courses')
          .insert([courseData]);
        
        if (error) throw error;
        toast({ title: "Success", description: "Course created successfully" });
      }

      resetForm();
      fetchCourses();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save course",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      code: course.code,
      name: course.name,
      description: course.description || "",
      department: course.department || "",
      level: course.level || "",
      credits: course.credits?.toString() || "",
      prerequisites: course.prerequisites?.join(', ') || ""
    });
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);
      
      if (error) throw error;
      toast({ title: "Success", description: "Course deleted successfully" });
      fetchCourses();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setEditingCourse(null);
    setFormData({
      code: "",
      name: "",
      description: "",
      department: "",
      level: "",
      credits: "",
      prerequisites: ""
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {editingCourse ? "Edit Course" : "Add New Course"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="code">Course Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g., COMP1010"
                required
              />
            </div>

            <div>
              <Label htmlFor="name">Course Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Introduction to Programming"
                required
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
              <Label htmlFor="level">Level</Label>
              <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="undergraduate">Undergraduate</SelectItem>
                  <SelectItem value="postgraduate">Postgraduate</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="credits">Credits</Label>
              <Input
                id="credits"
                type="number"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                placeholder="e.g., 6"
              />
            </div>

            <div>
              <Label htmlFor="prerequisites">Prerequisites (comma-separated)</Label>
              <Input
                id="prerequisites"
                value={formData.prerequisites}
                onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })}
                placeholder="e.g., MATH1001, COMP1001"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Course description..."
                rows={3}
              />
            </div>

            <div className="md:col-span-2 flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : (editingCourse ? "Update Course" : "Add Course")}
              </Button>
              {editingCourse && (
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
          <CardTitle>Existing Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-mono">{course.code}</TableCell>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.department}</TableCell>
                  <TableCell>
                    {course.level && (
                      <Badge variant="secondary">{course.level}</Badge>
                    )}
                  </TableCell>
                  <TableCell>{course.credits}</TableCell>
                  <TableCell>
                    {course.overall_rating > 0 ? (
                      <span>{course.overall_rating.toFixed(1)} ({course.total_reviews})</span>
                    ) : (
                      <span className="text-muted-foreground">No reviews</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(course)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(course.id)}
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