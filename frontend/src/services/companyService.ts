const API_BASE = (import.meta.env.VITE_API_BASE as string) || '';

function getAuthHeader() {
  try {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch (e) {
    return {};
  }
}

export interface CompanyPayload {
  name: string;
  cnpj?: string;
  email?: string;
  phone?: string;
  address?: string;
  logoUrl?: string;
  [key: string]: any;
}

export async function uploadFile(file: File): Promise<string> {
  const url = `${API_BASE}/api/upload`;
  const form = new FormData();
  form.append('file', file);

  const headers = getAuthHeader();

  const response = await fetch(url, {
    method: 'POST',
    headers: headers as Record<string, string>,
    body: form,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Upload failed: ${response.status} ${text}`);
  }

  const data = await response.json();
  // Expecting { url: string } or { data: { url } }
  if (data?.url) return data.url;
  if (data?.data?.url) return data.data.url;
  throw new Error('Upload response did not contain a file URL');
}

export async function createCompany(payload: CompanyPayload) {
  const url = `${API_BASE}/api/companies`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
  } as Record<string, string>;

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Create company failed: ${response.status} ${text}`);
  }

  return response.json();
}
