import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Cafe {
  id: string;
  name: string;
  description?: string;
  location?: string;
  price_range?: string;
  cuisine_type?: string[];
  menu_url?: string;
  latitude?: number;
  longitude?: number;
  overall_rating: number;
  total_reviews: number;
}

export const CafeEditor = () => {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingCafe, setEditingCafe] = useState<Cafe | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    price_range: "",
    cuisine_type: "",
    menu_url: "",
    latitude: "",
    longitude: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCafes();
  }, []);

  const fetchCafes = async () => {
    try {
      const { data, error } = await supabase
        .from('cafes')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setCafes(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load cafes",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cafeData = {
        name: formData.name,
        description: formData.description || null,
        location: formData.location || null,
        price_range: formData.price_range || null,
        cuisine_type: formData.cuisine_type ? formData.cuisine_type.split(',').map(c => c.trim()) : null,
        menu_url: formData.menu_url || null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null
      };

      if (editingCafe) {
        const { error } = await supabase
          .from('cafes')
          .update(cafeData)
          .eq('id', editingCafe.id);
        
        if (error) throw error;
        toast({ title: "Success", description: "Cafe updated successfully" });
      } else {
        const { error } = await supabase
          .from('cafes')
          .insert([cafeData]);
        
        if (error) throw error;
        toast({ title: "Success", description: "Cafe created successfully" });
      }

      resetForm();
      fetchCafes();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save cafe",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cafe: Cafe) => {
    setEditingCafe(cafe);
    setFormData({
      name: cafe.name,
      description: cafe.description || "",
      location: cafe.location || "",
      price_range: cafe.price_range || "",
      cuisine_type: cafe.cuisine_type?.join(', ') || "",
      menu_url: cafe.menu_url || "",
      latitude: cafe.latitude?.toString() || "",
      longitude: cafe.longitude?.toString() || ""
    });
  };

  const handleDelete = async (cafeId: string) => {
    if (!confirm("Are you sure you want to delete this cafe?")) return;

    try {
      const { error } = await supabase
        .from('cafes')
        .delete()
        .eq('id', cafeId);
      
      if (error) throw error;
      toast({ title: "Success", description: "Cafe deleted successfully" });
      fetchCafes();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete cafe",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setEditingCafe(null);
    setFormData({
      name: "",
      description: "",
      location: "",
      price_range: "",
      cuisine_type: "",
      menu_url: "",
      latitude: "",
      longitude: ""
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {editingCafe ? "Edit Cafe" : "Add New Cafe"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Cafe Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Campus Coffee Co."
                required
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Student Union Building"
              />
            </div>

            <div>
              <Label htmlFor="price_range">Price Range</Label>
              <Input
                id="price_range"
                value={formData.price_range}
                onChange={(e) => setFormData({ ...formData, price_range: e.target.value })}
                placeholder="e.g., $, $$, $$$"
              />
            </div>

            <div>
              <Label htmlFor="cuisine_type">Cuisine Types (comma-separated)</Label>
              <Input
                id="cuisine_type"
                value={formData.cuisine_type}
                onChange={(e) => setFormData({ ...formData, cuisine_type: e.target.value })}
                placeholder="e.g., Coffee, Sandwiches, Pastries"
              />
            </div>

            <div>
              <Label htmlFor="menu_url">Menu URL</Label>
              <Input
                id="menu_url"
                value={formData.menu_url}
                onChange={(e) => setFormData({ ...formData, menu_url: e.target.value })}
                placeholder="https://example.com/menu.pdf"
              />
            </div>

            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                placeholder="e.g., -32.927"
              />
            </div>

            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                placeholder="e.g., 151.779"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Cafe description..."
                rows={3}
              />
            </div>

            <div className="md:col-span-2 flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : (editingCafe ? "Update Cafe" : "Add Cafe")}
              </Button>
              {editingCafe && (
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
          <CardTitle>Existing Cafes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price Range</TableHead>
                <TableHead>Cuisine</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cafes.map((cafe) => (
                <TableRow key={cafe.id}>
                  <TableCell className="font-medium">{cafe.name}</TableCell>
                  <TableCell>{cafe.location}</TableCell>
                  <TableCell>
                    {cafe.price_range && (
                      <Badge variant="outline">{cafe.price_range}</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {cafe.cuisine_type?.slice(0, 2).map((cuisine, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {cuisine}
                        </Badge>
                      ))}
                      {cafe.cuisine_type && cafe.cuisine_type.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{cafe.cuisine_type.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {cafe.overall_rating > 0 ? (
                      <span>{cafe.overall_rating.toFixed(1)} ({cafe.total_reviews})</span>
                    ) : (
                      <span className="text-muted-foreground">No reviews</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(cafe)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(cafe.id)}
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