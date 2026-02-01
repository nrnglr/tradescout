// Backend adresin (C# projesi çalıştığında genelde 5000 veya 5001 olur)
// launchSettings.json dosyasından kontrol edebilirsin.
const API_URL = 'http://localhost:5000/api/auth'; 

export const authService = {
  // Kayıt Olma İsteği
  register: async (userData: any) => {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Kayıt başarısız.');
    return data;
  },

  // Giriş Yapma İsteği
  login: async (credentials: any) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Giriş başarısız.');
    
    // Gelen Token ve Kullanıcı bilgilerini tarayıcıya kaydet
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        fullName: data.fullName,
        credits: data.credits,
        role: data.role
      }));
    }
    
    return data;
  },

  // Çıkış Yapma
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};
