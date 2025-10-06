'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FaPaw, FaUserMd, FaDog, FaHospital, FaUsers } from 'react-icons/fa';

const roleOptions = [
  {
    id: 'pet-owner',
    title: 'Pet Owner',
    description: 'Find the best care for your beloved pets',
    icon: <FaPaw className="w-12 h-12 text-indigo-600 mb-4" />,
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    hoverColor: 'hover:border-indigo-400',
    textColor: 'text-indigo-700',
  },
  {
    id: 'veterinarian',
    title: 'Veterinarian',
    description: 'Join our network of professional vets',
    icon: <FaUserMd className="w-12 h-12 text-teal-600 mb-4" />,
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    hoverColor: 'hover:border-teal-400',
    textColor: 'text-teal-700',
  },
  {
    id: 'trainer',
    title: 'Pet Trainer',
    description: 'Help pets and their owners with training',
    icon: <FaDog className="w-12 h-12 text-amber-600 mb-4" />,
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    hoverColor: 'hover:border-amber-400',
    textColor: 'text-amber-700',
  },
  {
    id: 'hospital',
    title: 'Hospital/Clinic',
    description: 'Connect with pet owners in your area',
    icon: <FaHospital className="w-12 h-12 text-emerald-600 mb-4" />,
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    hoverColor: 'hover:border-emerald-400',
    textColor: 'text-emerald-700',
  },
  {
    id: 'organization',
    title: 'Organization',
    description: 'Partner with us for pet welfare',
    icon: <FaUsers className="w-12 h-12 text-purple-600 mb-4" />,
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    hoverColor: 'hover:border-purple-400',
    textColor: 'text-purple-700',
  },
];

export default function SelectRole() {
  const router = useRouter();

  const handleRoleSelect = (roleId: string) => {
    router.push('/role-selection');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Join <span className="text-indigo-600">Zoodo</span>
          </motion.h1>
          <motion.p 
            className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Select your role to get started with our veterinary platform
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {roleOptions.map((role, index) => (
            <motion.div
              key={role.id}
              className={`relative p-6 rounded-2xl border-2 ${role.borderColor} ${role.bgColor} ${role.hoverColor} transition-all duration-300 hover:shadow-lg cursor-pointer`}
              onClick={() => handleRoleSelect(role.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-white shadow-md">
                  {role.icon}
                </div>
                <h3 className={`mt-4 text-lg font-bold ${role.textColor}`}>
                  {role.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {role.description}
                </p>
              </div>
              <div className="absolute top-2 right-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-gray-800">
                  Select
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button 
              onClick={() => router.push('/login')}
              className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition duration-150 ease-in-out"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
