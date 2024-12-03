import { useState } from 'react';

type FetchMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'; // Métodos HTTP aceptados
type FetchHeaders = Record<string, string>; // Tipo para los headers de la solicitud

interface UseApiReturn {
  fetchData: <T = any>(
    method: FetchMethod,
    url: string,
    body?: Record<string, any> | null,
    headers?: FetchHeaders
  ) => Promise<T | null>;
  loading: boolean;
  error: string | null;
}

const useApi = (): UseApiReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async <T = any>(
    method: FetchMethod,
    url: string,
    body: Record<string, any> | null = null,
    headers: FetchHeaders = {}
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    // Token de autorización
    const loginToken = localStorage.getItem('loginToken');

    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${loginToken}`,
          ...headers,
        },
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data: T = await response.json();
      return data;
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchData, loading, error };
};

export default useApi;
