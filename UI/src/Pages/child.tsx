import React from 'react';

interface ChildComponentProps {
  message: string;
  count: number;
}

const ChildComponent: React.FC<ChildComponentProps> = ({ message, count }) => {
  return (
    <div>
      <p>{message}</p>
      <p>Count: {count}</p>
    </div>
  );
};

export default ChildComponent;
