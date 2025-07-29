import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';

interface SearchResult {
  professors?: any[];
  courses?: any[];
  buildings?: any[];
  cafes?: any[];
}

interface SearchInterfaceProps {
  initialQuery?: string;
}

const SearchInterface: React.FC<SearchInterfaceProps> = ({ initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult>({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults({});
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('search', {
        body: { query: searchQuery, type: activeTab === 'all' ? 'all' : activeTab }
      });

      if (error) throw error;
      setResults(data || {});
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query.length > 2) {
        performSearch(query);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, activeTab]);

  const renderStars = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  const ResultCard: React.FC<{ item: any; type: string }> = ({ item, type }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          {type === 'course' ? `${item.code} - ${item.name}` : item.name}
        </CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {renderStars(item.overall_rating || 0)} ({item.total_reviews || 0} reviews)
          </span>
          <Badge variant="outline" className="text-xs">
            {type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {item.description || item.bio || `${type} information`}
        </p>
        {type === 'professor' && item.department && (
          <Badge variant="secondary" className="mt-2">{item.department}</Badge>
        )}
        {type === 'building' && item.location && (
          <Badge variant="secondary" className="mt-2">{item.location}</Badge>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search professors, courses, buildings, cafes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-4"
        />
        <Button variant="outline" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Results */}
      {(Object.keys(results).length > 0 || loading) && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="professors">Professors</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="buildings">Buildings</TabsTrigger>
            <TabsTrigger value="cafes">Cafes</TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-muted-foreground">Searching...</p>
            </div>
          ) : (
            <>
              <TabsContent value="all" className="space-y-6">
                {Object.entries(results).map(([type, items]) => (
                  items && items.length > 0 && (
                    <div key={type}>
                      <h3 className="text-lg font-semibold mb-3 capitalize">{type}</h3>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {items.slice(0, 6).map((item: any) => (
                          <ResultCard key={item.id} item={item} type={type} />
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </TabsContent>

              {['professors', 'courses', 'buildings', 'cafes'].map((type) => (
                <TabsContent key={type} value={type}>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {results[type as keyof SearchResult]?.map((item: any) => (
                      <ResultCard key={item.id} item={item} type={type} />
                    ))}
                  </div>
                </TabsContent>
              ))}
            </>
          )}
        </Tabs>
      )}

      {query.length > 2 && !loading && Object.keys(results).length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No results found for "{query}"</p>
        </div>
      )}
    </div>
  );
};

export default SearchInterface;