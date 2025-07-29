import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Star, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ReviewFormProps {
  itemType: 'professor' | 'course' | 'building' | 'cafe';
  itemId: string;
  onSubmit?: () => void;
  onCancel?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ itemType, itemId, onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [overallRating, setOverallRating] = useState(0);
  const [specificRatings, setSpecificRatings] = useState<any>({});
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [semester, setSemester] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to submit a review",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('reviews', {
        body: {
          reviewable_type: itemType,
          reviewable_id: itemId,
          overall_rating: overallRating,
          specific_ratings: specificRatings,
          title,
          content,
          tags,
          is_anonymous: isAnonymous,
          semester: semester || null,
          year: year ? parseInt(year) : null,
        },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Review submitted successfully!",
      });

      // Reset form
      setTitle('');
      setContent('');
      setOverallRating(0);
      setSpecificRatings({});
      setTags([]);
      setSemester('');
      setYear('');
      
      onSubmit?.();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit review",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStarRating = (rating: number, onChange: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-6 w-6 cursor-pointer transition-colors ${
              star <= rating ? 'fill-primary text-primary' : 'text-muted-foreground'
            }`}
            onClick={() => onChange(star)}
          />
        ))}
      </div>
    );
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const getSpecificRatingFields = () => {
    switch (itemType) {
      case 'course':
        return [
          { key: 'difficulty', label: 'Difficulty' },
          { key: 'usefulness', label: 'Usefulness' },
          { key: 'workload', label: 'Workload' },
        ];
      case 'building':
        return [
          { key: 'wifi', label: 'WiFi Quality' },
          { key: 'study_spaces', label: 'Study Spaces' },
          { key: 'accessibility', label: 'Accessibility' },
          { key: 'cleanliness', label: 'Cleanliness' },
        ];
      case 'cafe':
        return [
          { key: 'food_quality', label: 'Food Quality' },
          { key: 'value', label: 'Value for Money' },
          { key: 'service', label: 'Service' },
          { key: 'atmosphere', label: 'Atmosphere' },
        ];
      default:
        return [];
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Overall Rating */}
          <div className="space-y-2">
            <Label>Overall Rating *</Label>
            {renderStarRating(overallRating, setOverallRating)}
          </div>

          {/* Specific Ratings */}
          {getSpecificRatingFields().map(({ key, label }) => (
            <div key={key} className="space-y-2">
              <Label>{label}</Label>
              {renderStarRating(
                specificRatings[key] || 0,
                (rating) => setSpecificRatings({ ...specificRatings, [key]: rating })
              )}
            </div>
          ))}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief summary of your review"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Review Content *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your detailed experience..."
              rows={4}
              required
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Semester/Year for courses */}
          {itemType === 'course' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Input
                  id="semester"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  placeholder="e.g., Semester 1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="e.g., 2024"
                />
              </div>
            </div>
          )}

          {/* Anonymous option */}
          <div className="flex items-center space-x-2">
            <Switch
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
            />
            <Label htmlFor="anonymous">Post anonymously</Label>
          </div>

          {/* Submit buttons */}
          <div className="flex gap-4">
            <Button type="submit" disabled={loading || !overallRating || !content.trim()}>
              {loading ? 'Submitting...' : 'Submit Review'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;