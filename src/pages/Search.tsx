import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Footer from "@/components/Footer";
import SearchInterface from "@/components/SearchInterface";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <Layout>
      <div className="bg-background">
        <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Search Results
          </h1>
          {query && (
            <p className="text-muted-foreground text-lg">
              Results for "{query}"
            </p>
          )}
        </div>

        <SearchInterface initialQuery={query} />
        </div>
        
        <Footer />
      </div>
    </Layout>
  );
};

export default Search;