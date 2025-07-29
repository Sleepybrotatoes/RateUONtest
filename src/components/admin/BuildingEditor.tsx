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

interface Building {
  id: string;
  name: string;
  code?: string;
  description?: string;
  location?: string;
  building_type?: string;
  facilities?: string[];
  latitude?: number;
  longitude?: number;
  overall_rating: number;
  total_reviews: number;
}

export const BuildingEditor = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    location: "",
    building_type: "",
    facilities: "",
    latitude: "",
    longitude: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    try {
      const { data, error } = await supabase
        .from('buildings')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setBuildings(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load buildings",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const buildingData = {
        name: formData.name,
        code: formData.code || null,
        description: formData.description || null,
        location: formData.location || null,
        building_type: formData.building_type || null,
        facilities: formData.facilities ? formData.facilities.split(',').map(f => f.trim()) : null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null
      };

      if (editingBuilding) {
        const { error } = await supabase
          .from('buildings')
          .update(buildingData)
          .eq('id', editingBuilding.id);
        
        if (error) throw error;
        toast({ title: "Success", description: "Building updated successfully" });
      } else {
        const { error } = await supabase
          .from('buildings')
          .insert([buildingData]);
        
        if (error) throw error;
        toast({ title: "Success", description: "Building created successfully" });
      }

      resetForm();
      fetchBuildings();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save building",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (building: Building) => {
    setEditingBuilding(building);
    setFormData({
      name: building.name,
      code: building.code || "",
      description: building.description || "",
      location: building.location || "",
      building_type: building.building_type || "",
      facilities: building.facilities?.join(', ') || "",
      latitude: building.latitude?.toString() || "",
      longitude: building.longitude?.toString() || ""
    });
  };

  const handleDelete = async (buildingId: string) => {
    if (!confirm("Are you sure you want to delete this building?")) return;

    try {
      const { error } = await supabase
        .from('buildings')
        .delete()
        .eq('id', buildingId);
      
      if (error) throw error;
      toast({ title: "Success", description: "Building deleted successfully" });
      fetchBuildings();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete building",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setEditingBuilding(null);
    setFormData({
      name: "",
      code: "",
      description: "",
      location: "",
      building_type: "",
      facilities: "",
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
            {editingBuilding ? "Edit Building" : "Add New Building"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Building Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Engineering Building"
                required
              />
            </div>

            <div>
              <Label htmlFor="code">Building Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g., ENG"
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., North Campus"
              />
            </div>

            <div>
              <Label htmlFor="building_type">Building Type</Label>
              <Input
                id="building_type"
                value={formData.building_type}
                onChange={(e) => setFormData({ ...formData, building_type: e.target.value })}
                placeholder="e.g., Academic, Residential, Administrative"
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

            <div>
              <Label htmlFor="facilities">Facilities (comma-separated)</Label>
              <Input
                id="facilities"
                value={formData.facilities}
                onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
                placeholder="e.g., WiFi, Elevator, Air Conditioning"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Building description..."
                rows={3}
              />
            </div>

            <div className="md:col-span-2 flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : (editingBuilding ? "Update Building" : "Add Building")}
              </Button>
              {editingBuilding && (
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
          <CardTitle>Existing Buildings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buildings.map((building) => (
                <TableRow key={building.id}>
                  <TableCell className="font-medium">{building.name}</TableCell>
                  <TableCell>
                    {building.code && (
                      <Badge variant="outline">{building.code}</Badge>
                    )}
                  </TableCell>
                  <TableCell>{building.location}</TableCell>
                  <TableCell>{building.building_type}</TableCell>
                  <TableCell>
                    {building.overall_rating > 0 ? (
                      <span>{building.overall_rating.toFixed(1)} ({building.total_reviews})</span>
                    ) : (
                      <span className="text-muted-foreground">No reviews</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(building)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(building.id)}
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