import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENT_EMP_KEY = '@recent_employee_id';

export const RecentEmployeeStore = {
  saveId: async (id: string) => {
    await AsyncStorage.setItem(RECENT_EMP_KEY, id);
  },
  getId: async (): Promise<string | null> => {
    return await AsyncStorage.getItem(RECENT_EMP_KEY);
  },
  clearId: async () => {
    await AsyncStorage.removeItem(RECENT_EMP_KEY);
  }
};