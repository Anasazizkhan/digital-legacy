import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUserShield, FaPlus, FaEnvelope, FaPhone } from 'react-icons/fa';

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
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-4">Trusted Contacts</h1>
          <p className="text-gray-400">
            Manage contacts who can access your messages posthumously
          </p>
        </motion.div>

        <div className="grid gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black/50 p-6 rounded-lg border border-white/10"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <FaUserShield className="w-6 h-6 text-gray-400" />
                <h2 className="text-xl font-semibold">Add Trusted Contact</h2>
              </div>
              <button className="btn-primary flex items-center space-x-2">
                <FaPlus className="w-4 h-4" />
                <span>Add Contact</span>
              </button>
            </div>
            <p className="text-gray-400 mb-4">
              Trusted contacts will be notified when conditions for message delivery are met
            </p>
          </motion.div>

          {contacts.map((contact, index) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-black/50 p-6 rounded-lg border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{contact.name}</h3>
                  <div className="flex items-center space-x-4 mt-2">
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
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    contact.status === 'verified' 
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-4">
                <div className="text-sm text-gray-400">
                  {contact.messages} message{contact.messages !== 1 && 's'} assigned
                </div>
                <button className="text-sm text-gray-400 hover:text-white transition-colors">
                  Manage Access
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustedContacts; 