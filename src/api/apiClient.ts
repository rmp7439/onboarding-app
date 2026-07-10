// Use local IP for Android emulator, localhost for iOS simulator
const API_URL = process.env.EXPO_PUBLIC_API_URL ||  "http://192.168.0.249:5000/api";

export const api = {
  registerEmployee: async (employeeData: any) => {
    const response = await fetch(`${API_URL}/employee/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employeeData),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Registration failed');
    return result.data;
  },

  uploadSelfie: async (employeeId: string, photoUri: string) => {
    const formData = new FormData();
    const filename = photoUri.split('/').pop() || 'selfie.jpg';
    
    formData.append('selfie', {
      uri: photoUri,
      name: filename,
      type: 'image/jpeg',
    } as any);

    const response = await fetch(`${API_URL}/employee/${employeeId}/selfie`, {
      method: 'POST',
      body: formData,
    });
    
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Selfie upload failed');
    return result.data;
  },

  uploadDocument: async (employeeId: string, type: string, fileUri: string) => {
    const formData = new FormData();
    const filename = fileUri.split('/').pop() || 'document.jpg';
    
    // Fallback mime-type extraction
    const match = /\.(\w+)$/.exec(filename);
    const mimeType = match ? `image/${match[1]}` : `image/jpeg`;

    formData.append('document', {
      uri: fileUri,
      name: filename,
      type: mimeType,
    } as any);
    
    formData.append('type', type);

    const response = await fetch(`${API_URL}/employee/${employeeId}/document`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || `Failed to upload ${type}`);
    return result.data;
  },

  searchEmployees: async (query: string) => {
    // Assuming the backend provides a search endpoint. If not, this routes to a standard GET with a query param.
    const response = await fetch(`${API_URL}/employees/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Search failed');
    return result.data;
  },

  getEmployeeProfile: async (employeeId: string) => {
    const response = await fetch(`${API_URL}/employee/profile/${employeeId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to fetch profile');
    return result.data;
  }
};