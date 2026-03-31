import { supabase } from './supabase';

const API_URL = 'https://hackaton-create-a-good-app.onrender.com/api';

const getToken = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
};

const request = async (endpoint, options = {}) => {
  const token = await getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };

  // Don't set Content-Type for FormData
  if (options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  const res = await fetch(`${API_URL}${endpoint}`, config);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erreur serveur');
  return data;
};

// ─── Auth ───
export const authAPI = {
  login: (email, password) => request('/auth/login', {
    method: 'POST', body: JSON.stringify({ email, password }),
  }),
  register: (email, password) => request('/auth/register', {
    method: 'POST', body: JSON.stringify({ email, password }),
  }),
  me: () => request('/auth/me'),
};

// ─── Students ───
export const studentsAPI = {
  create: (data) => request('/students', {
    method: 'POST', body: JSON.stringify(data),
  }),
  update: (data) => request('/students', {
    method: 'PUT', body: JSON.stringify(data),
  }),
  list: () => request('/students'),
  get: (id) => request(`/students/${id}`),
  search: (params) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/students/search/query?${qs}`);
  },
};

// ─── Companies ───
export const companiesAPI = {
  create: (data) => request('/companies', {
    method: 'POST', body: JSON.stringify(data),
  }),
  update: (data) => request('/companies', {
    method: 'PUT', body: JSON.stringify(data),
  }),
  get: (id) => request(`/companies/${id}`),
};

// ─── Offers ───
export const offersAPI = {
  create: (data) => request('/offers', {
    method: 'POST', body: JSON.stringify(data),
  }),
  list: () => request('/offers'),
  mine: () => request('/offers/mine'),
  get: (id) => request(`/offers/${id}`),
  update: (id, data) => request(`/offers/${id}`, {
    method: 'PUT', body: JSON.stringify(data),
  }),
  delete: (id) => request(`/offers/${id}`, { method: 'DELETE' }),
  search: (params) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/offers/search/query?${qs}`);
  },
};

// ─── Applications ───
export const applicationsAPI = {
  create: (data) => request('/applications', {
    method: 'POST', body: JSON.stringify(data),
  }),
  studentList: () => request('/applications/student'),
  companyList: () => request('/applications/company'),
  update: (id, data) => request(`/applications/${id}`, {
    method: 'PUT', body: JSON.stringify(data),
  }),
  delete: (id) => request(`/applications/${id}`, { method: 'DELETE' }),
  check: (offerId) => request(`/applications/check?offer_id=${offerId}`),
  checkAsCompany: (studentId, offerId = null) => {
    let url = `/applications/check-as-company?student_id=${studentId}`;
    if (offerId) url += `&offer_id=${offerId}`;
    return request(url);
  },
};

// ─── Conversations ───
export const conversationsAPI = {
  list: () => request('/conversations'),
  create: (data) => request('/conversations', {
    method: 'POST', body: JSON.stringify(data),
  }),
};

// ─── Messages ───
export const messagesAPI = {
  list: (conversationId) => request(`/messages/${conversationId}`),
  send: (data) => request('/messages', {
    method: 'POST', body: JSON.stringify(data),
  }),
  markRead: (conversationId) => request(`/messages/read/${conversationId}`, { method: 'PUT' }),
};

// ─── Storage ───
export const storageAPI = {
  uploadCV: async (fileUri, fileName, mimeType) => {
    const token = await getToken();
    const form = new FormData();
    form.append('file', { uri: fileUri, name: fileName, type: mimeType });
    const res = await fetch(`${API_URL}/storage/cv`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return data;
  },
  uploadDocument: async (fileUri, fileName, mimeType) => {
    const token = await getToken();
    const form = new FormData();
    form.append('file', { uri: fileUri, name: fileName, type: mimeType });
    const res = await fetch(`${API_URL}/storage/document`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return data;
  },
  analyzeCV: async (fileUri, fileName, mimeType) => {
    const token = await getToken();
    const form = new FormData();
    form.append('cv', { uri: fileUri, name: fileName, type: mimeType });
    const res = await fetch(`${API_URL}/cvAnalytics/analyze`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Analysis failed');
    return data;
  },
  analyzeOffer: async (fileUri, fileName, mimeType) => {
    const token = await getToken();
    const form = new FormData();
    form.append('pdf', { uri: fileUri, name: fileName, type: mimeType });
    const res = await fetch(`${API_URL}/cvAnalytics/analyzeOffer`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Analysis failed');
    return data;
  },
  deleteCV: () => request('/storage/cv', { method: 'DELETE' }),
  getCVUrl: (userId) => `${API_URL}/storage/cv/${userId}`,
};

// ─── Recommendations ───
export const recommendationsAPI = {
  getForStudent: (studentId) => request(`/recommendations/offers/${studentId}`),
  getForOffer: (offerId) => request(`/recommendations/students/${offerId}`),
};

// ─── References ───
export const referencesAPI = {
  list: () => request('/references'),
};
