import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = '@employee_session';

export interface EmployeeSession {
  employeeId: string;
  userId: string; // Updated from mobile to userId
  token: string;
}

export const Session = {
  saveEmployeeSession: async (session: EmployeeSession) => {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },
  getEmployeeSession: async (): Promise<EmployeeSession | null> => {
    const data = await AsyncStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  },
  clearEmployeeSession: async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
  }
};