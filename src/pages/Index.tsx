import HeroSection from "@/components/HeroSection";
import FeaturedSection from "@/components/FeaturedSection";
import QuickActions from "@/components/QuickActions";
import Footer from "@/components/Footer";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="bg-background">
        <HeroSection />
        
        <QuickActions />
        <FeaturedSection />
        
        {/* Call to Action for Authentication */}
        {!user && (
          <section className="py-16 px-4 bg-muted/50">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Join the UON Community</h2>
              <p className="text-muted-foreground mb-6 text-lg">
                Sign up to write reviews, participate in forums, and share your campus experience
              </p>
              <Button size="lg" onClick={() => navigate('/auth')}>
                Get Started
              </Button>
            </div>
          </section>
        )}
        
        <Footer />
      </div>
    </Layout>
  );
};

export default Index;
