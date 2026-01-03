
import { renderHook, act } from '@testing-library/react-hooks';
import { AuthProvider, useAuth } from './AuthContext';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

// Mock Firebase modules
jest.mock('@/lib/firebase', () => ({
  auth: {},
  db: {},
}));

jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'),
  createUserWithEmailAndPassword: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  ...jest.requireActual('firebase/firestore'),
  doc: jest.fn((_, __, id) => ({ path: `users/${id}` })),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
}));

const mockUser = {
  uid: '12345',
  email: 'test@example.com',
};

describe('AuthContext', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (createUserWithEmailAndPassword as jest.Mock).mockClear();
    (onAuthStateChanged as jest.Mock).mockClear();
    (getDoc as jest.Mock).mockClear();
    (setDoc as jest.Mock).mockClear();
    (updateDoc as jest.Mock).mockClear();
  });

  it('should set isProducer to false for a new user on signUp', async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({ user: mockUser });
    (getDoc as jest.Mock).mockResolvedValue({ exists: () => true, data: () => ({ email: 'test@example.com', isProducer: false }) });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      await result.current.signUp('test@example.com', 'password123');
    });

    expect(setDoc).toHaveBeenCalledWith(
      expect.objectContaining({ path: 'users/12345' }),
      expect.objectContaining({ isProducer: false })
    );
  });

  it('should update user to producer', async () => {
    // 1. Setup initial state: user is logged in, profile is loaded
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(mockUser);
      return () => {}; // Return an unsubscribe function
    });
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ email: 'test@example.com', isProducer: false }),
    });

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    // Wait for the user profile to be loaded
    await waitForNextUpdate();

    // Verify initial state
    expect(result.current.userProfile?.isProducer).toBe(false);

    // 2. Call the function
    await act(async () => {
      await result.current.activateProducerProfile();
    });

    // 3. Verify firestore call
    expect(updateDoc).toHaveBeenCalledWith(
      expect.objectContaining({ path: 'users/12345' }),
      { isProducer: true }
    );

    // 4. Verify local state update
    expect(result.current.userProfile?.isProducer).toBe(true);
  });
});
