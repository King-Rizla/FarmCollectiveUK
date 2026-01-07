
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, Mail, Phone, MapPin } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useContactForm } from "@/hooks/useContactForm";

const ContactPage = () => {
  const { formData, isSubmitted, handleChange, handleSubmit } = useContactForm();

  return (
    <div className="bg-white">
      <Navbar />
      <main className="container mx-auto px-4 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-semibold text-green-800">
              Get in Touch
            </h1>
            <p className="mt-4 text-lg text-green-700 max-w-2xl mx-auto">
              We'd love to hear from you! Whether you have a question, feedback,
              or just want to say hello, feel free to reach out.
            </p>
          </div>

          <Card className="border-green-100 bg-white overflow-hidden shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Contact Form */}
              <div className="p-8">
                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                    <h2 className="text-2xl font-semibold text-green-800">
                      Thank you!
                    </h2>
                    <p className="text-green-700 mt-2">
                      Your message has been sent successfully. We'll get back to
                      you shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name" className="text-green-800">
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-green-800">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john.doe@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="subject" className="text-green-800">
                        Subject
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="General Inquiry"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="message" className="text-green-800">
                        Message
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        rows={5}
                        placeholder="Your message here..."
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="mt-1"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-green-700 hover:bg-green-800 text-white"
                    >
                      Send Message
                    </Button>
                  </form>
                )}
              </div>

              {/* Contact Information */}
              <div className="bg-green-50 p-8">
                <h3 className="text-2xl font-semibold text-green-800 mb-6">
                  Contact Information
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 text-green-600 mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-green-800">Our Office</h4>
                      <p className="text-green-700">
                        123 Green Way, Farmtown, FT 56789, United Kingdom
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="h-6 w-6 text-green-600 mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-green-800">Email Us</h4>
                      <a
                        href="mailto:hello@farmily.co.uk"
                        className="text-green-700 hover:text-green-900 transition"
                      >
                        hello@farmily.co.uk
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-6 w-6 text-green-600 mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-green-800">Call Us</h4>
                      <a
                        href="tel:+441234567890"
                        className="text-green-700 hover:text-green-900 transition"
                      >
                        +44 (0) 123 456 7890
                      </a>
                    </div>
                  </div>
                </div>
                <div className="mt-8 border-t border-green-200 pt-6">
                  <h4 className="font-medium text-green-800 mb-3">
                    Follow Us
                  </h4>
                  <div className="flex space-x-4">
                    <a href="#" className="text-green-700 hover:text-green-900">
                      <svg
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.26C11.73,8.58 11.77,8.9 11.84,9.2C8.28,9.03 5.15,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16.03 6.02,17.25 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.8C20.33,8.62 20.33,8.43 20.32,8.25C21.16,7.63 21.88,6.87 22.46,6Z"></path>
                      </svg>
                    </a>
                    <a href="#" className="text-green-700 hover:text-green-900">
                      <svg
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163m0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.059 1.689.073 4.948.073s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98C15.667.014 15.259 0 12 0zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zM12 16c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44s-1.44-.645-1.44-1.44.646-1.44 1.44-1.44 1.44.645 1.44 1.44z"></path>
                      </svg>
                    </a>
                    <a href="#" className="text-green-700 hover:text-green-900">
                      <svg
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
