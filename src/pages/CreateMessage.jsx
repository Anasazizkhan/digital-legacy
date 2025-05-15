import { motion } from 'framer-motion';
import { FaEnvelope } from 'react-icons/fa';
import PageLayout from '../components/PageLayout';
import MessageCreator from '../components/MessageCreator';

const CreateMessage = () => {
  return (
    <PageLayout
      title="Create Time Capsule Message"
      description="Create and schedule messages for future delivery"
      icon={FaEnvelope}
      backgroundImage="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=1920&q=80"
    >
      <div className="has-navbar-spacing">
        <MessageCreator />
      </div>
    </PageLayout>
  );
};

export default CreateMessage; 