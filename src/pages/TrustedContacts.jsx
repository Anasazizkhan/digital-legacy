import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUserShield, FaPlus, FaEnvelope, FaPhone, FaEllipsisH } from 'react-icons/fa';
import PageLayout from '../components/PageLayout';

const TrustedContacts = () => {
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 234 567 8900',
      status: 'verified',
      messages: 3
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1 234 567 8901',
      status: 'pending',
      messages: 1
    }
  ]);

  return (
    <PageLayout
      title="Trusted Contacts"
      description="Manage contacts who can access your messages posthumously"
      icon={FaUserShield}
      backgroundImage="https://images.unsplash.com/photo-1517167685284-96a27681ad75?auto=format&fit=crop&w=1920&q=80"
    >
      <div className="max-w-4xl mx-auto">
        <div className="grid gap-6">
          {/* Add Contact Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-black/30 backdrop-blur-sm border border-white/10 p-6 rounded-lg hover:border-white/20 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-white/5 text-white">
                  <FaUserShield className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-1">Add Trusted Contact</h2>
                  <p className="text-sm text-gray-400">
                    Trusted contacts will be notified when conditions for message delivery are met
                  </p>
                </div>
              </div>
              <button className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors duration-200 flex items-center space-x-2">
                <FaPlus className="w-4 h-4" />
                <span>Add Contact</span>
              </button>
            </div>
          </motion.div>

          {/* Contact Cards */}
          {contacts.map((contact, index) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * (index + 1) }}
              className="bg-black/30 backdrop-blur-sm border border-white/10 p-6 rounded-lg hover:border-white/20 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-lg bg-white/5 text-white">
                    <FaUserShield className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{contact.name}</h3>
                    <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
                      <div className="flex items-center space-x-2 text-gray-400">
                        <FaEnvelope className="w-4 h-4" />
                        <span className="text-sm">{contact.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <FaPhone className="w-4 h-4" />
                        <span className="text-sm">{contact.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="px-3 py-1 bg-white/5 rounded-full text-sm text-white">
                    {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                  </span>
                  <button className="p-2 hover:bg-white/5 rounded-lg transition-colors duration-200">
                    <FaEllipsisH className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-4">
                <div className="text-sm text-gray-400">
                  {contact.messages} message{contact.messages !== 1 && 's'} assigned
                </div>
                <button className="px-4 py-2 bg-white/5 text-white text-sm rounded-lg hover:bg-white/10 transition-colors duration-200">
                  Manage Access
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default TrustedContacts; 