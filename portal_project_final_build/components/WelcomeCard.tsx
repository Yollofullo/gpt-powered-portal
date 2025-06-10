
import React from 'react';

type WelcomeCardProps = {
  username: string;
  role: string;
};

const WelcomeCard: React.FC<WelcomeCardProps> = ({ username, role }) => {
console.log('🔍 [WelcomeCard.tsx] Entering function: const WelcomeCard: React.FC<WelcomeCardProps> = ');
  return (
    <div style={{
      border: '1px solid #ccc',
      padding: '20px',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
      maxWidth: '400px',
      margin: '20px auto',
      textAlign: 'center'
    }}>
      <h2>Welcome, {username}!</h2>
      <p>You are logged in as: <strong>{role}</strong></p>
    </div>
  );
};

export default WelcomeCard;
