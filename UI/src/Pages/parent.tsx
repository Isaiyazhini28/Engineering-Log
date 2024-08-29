import React, { useState } from 'react';
import ChildComponent from './child';

const ParentComponent: React.FC = () => {
  const [count, setCount] = useState(0);

  const incrementCount = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <h1>Parent Component</h1>
      <ChildComponent count={count}
        message="Hello from Parent Component" />
    </div>
  );
};

export default ParentComponent;
