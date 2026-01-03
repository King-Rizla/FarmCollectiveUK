
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const BecomeProducerPage = () => {
  const { activateProducerProfile } = useAuth();
  const navigate = useNavigate();

  const handleConfirm = async () => {
    try {
      await activateProducerProfile();
      alert("Congratulations! You are now a producer.");
      navigate("/profile");
    } catch (error) {
      alert("There was an error upgrading your profile. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto py-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Become a Producer</h1>
      <p className="mb-6">Are you sure you want to upgrade your profile to a Producer account?</p>
      <Button onClick={handleConfirm}>Confirm & Upgrade</Button>
    </div>
  );
};

export default BecomeProducerPage;
