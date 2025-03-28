import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary py-12">
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Prashil Foundation</h3>
            <p className="text-border">
              Empowering futures through education and financial guidance.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-border hover:text-primary">
                  Prashil Educare
                </a>
              </li>
              <li>
                <a href="#" className="text-border hover:text-primary">
                  Prashil EduGuide
                </a>
              </li>
              <li>
                <a href="#" className="text-border hover:text-primary">
                  Prashil Finance
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-border">
              <li>educare@prashilfoundation.com</li>
              <li>eduguide@prashilfoundation.com</li>
              <li>finance@prashilfoundation.com</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/share/1HKmiHRQ6e/" className="text-border hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://youtube.com/@prashilfoundation" className="text-border hover:text-primary">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/prashilfoundation" className="text-border hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/company/106925287/" className="text-border hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-border">
          <p>&copy; {new Date().getFullYear()} Prashil Foundation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}