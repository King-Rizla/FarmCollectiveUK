
import { useState } from "react";

export const useContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would handle the form submission here
    // (e.g., send data to an API endpoint)
    console.log(formData);
    setIsSubmitted(true);
  };

  return { formData, isSubmitted, handleChange, handleSubmit };
};
