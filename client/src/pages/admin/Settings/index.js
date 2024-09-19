import React, { useState } from 'react';
import { promoteUserToAdmin } from '../../../apicalls/users';

const Index = () => {
  const [email, setEmail] = useState('');
  const [examName, setExamName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const payload = { email, examName };
    const response = await promoteUserToAdmin(payload);

    if (response.success) {
      setMessage(`User promoted to admin with access to ${examName}`);
    } else {
      setMessage(`Failed to promote user: ${response.message}`);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6 text-center">Assign Admin Role and Exam Access</h2>
      <form onSubmit={handleSubmit}>
        {/* Email Input */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">User Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter user email"
            className="block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Exam Name Input */}
        <div className="mb-4">
          <label htmlFor="examName" className="block text-gray-700 font-bold mb-2">Exam Name:</label>
          <input
            type="text"
            id="examName"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            placeholder="Enter exam name"
            className="block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
          >
            {loading ? 'Assigning...' : 'Assign Admin'}
          </button>
        </div>
      </form>

      {message && <div className="mt-4 text-center text-red-500">{message}</div>}
    </div>
  );
};

export default Index;
