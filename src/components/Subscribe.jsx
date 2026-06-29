// src/components/Subscribe.tsx
import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const Subscribe = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubscribe = async () => {
    if (!email) {
      setMessage('Please enter a valid email.');
      return;
    }

    try {
      await addDoc(collection(db, 'subscriptions'), {
        email: email,
        subscribedAt: Timestamp.now()
      });
      setEmail('');
      setMessage('Subscribed successfully!');
    } catch (error) {
      console.error('Error adding subscription:', error);
      setMessage('Something went wrong. Try again.');
    }
  };

  return (
    <div className="bg-brown text-white p-6 md:flex justify-between items-center rounded-lg">
      <div className="mb-4 md:mb-0">
        <h3 className="text-xl font-bold">Stay Updated</h3>
        <p className="text-sm">Subscribe for the latest news and updates.</p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-3">
        <input
          type="email"
          className="px-4 py-2 rounded-md text-black"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="bg-crimson hover:bg-darkgrey text-white font-bold py-2 px-4 rounded-md"
          onClick={handleSubscribe}
        >
          Subscribe
        </button>
      </div>
      {message && <p className="text-sm mt-2 md:mt-0 text-green-200">{message}</p>}
    </div>
  );
};

export default Subscribe;
