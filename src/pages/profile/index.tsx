
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
  const { isProducer, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (isProducer) {
        navigate('/profile/producer');
      } else {
        navigate('/profile/consumer');
      }
    }
  }, [isProducer, loading, navigate]);

  return null; // Or a loading spinner
};

export default ProfilePage;
