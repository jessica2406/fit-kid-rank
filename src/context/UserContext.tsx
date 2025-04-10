
import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface UserTest {
  id: string;
  testId: string;
  testName: string;
  category: string;
  score: number;
  percentile: number;
  date: string;
}

export interface User {
  id: string;
  name: string;
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female';
  school?: string;
  class?: string;
  password?: string; // Add the password property as optional
  tests: UserTest[];
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  updateProfile: (userData: Partial<User>) => void;
  addTestResult: (test: UserTest) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    } else {
      setUser({ ...userData, id: Date.now().toString(), tests: [] } as User);
    }
  };

  const addTestResult = (test: UserTest) => {
    if (user) {
      // Replace existing test result or add new one
      const existingTestIndex = user.tests.findIndex(t => t.testId === test.testId);
      if (existingTestIndex !== -1) {
        const updatedTests = [...user.tests];
        updatedTests[existingTestIndex] = test;
        setUser({ ...user, tests: updatedTests });
      } else {
        setUser({ ...user, tests: [...user.tests, test] });
      }
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateProfile, addTestResult }}>
      {children}
    </UserContext.Provider>
  );
};
