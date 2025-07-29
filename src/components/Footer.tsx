import { Star, Github, Twitter, Mail, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const footerLinks = {
    Platform: [
      { name: "Browse Professors", href: "#" },
      { name: "Find Courses", href: "#" },
      { name: "Campus Map", href: "#" },
      { name: "Discussion Forums", href: "#" },
    ],
    Community: [
      { name: "Guidelines", href: "#" },
      { name: "Moderation", href: "#" },
      { name: "Student Safety", href: "#" },
      { name: "Report Content", href: "#" },
    ],
    Resources: [
      { name: "Help Center", href: "#" },
      { name: "API Documentation", href: "#" },
      { name: "Mobile App", href: "#" },
      { name: "Campus Partners", href: "#" },
    ],
    Company: [
      { name: "About Us", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Contact", href: "#" },
    ],
  };

  return (
    <footer className="bg-card/50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <Star className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
                RateUON
              </span>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Empowering students to make informed decisions about their campus experience through honest reviews and community discussions.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-foreground mb-3">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground mb-4 md:mb-0">
              © 2024 RateUON. All rights reserved.
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>for students everywhere</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;