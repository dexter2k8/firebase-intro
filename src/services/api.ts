function apiFetcher(method: string, url: string, body?: object, token?: string) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  return fetch(url, {
    method, // Utiliza o método passado como argumento (GET, POST, etc.)
    headers,
    body: body ? JSON.stringify(body) : undefined, // Só envia o body se ele existir
  }).then((res) => {
    if (!res.ok) {
      return res.json().then((errorData) => {
        throw { message: errorData.message, status: res.status };
      });
    }
    return res.json().then((data) => ({ res, data }));
  });
}

// Métodos específicos para GET e POST
const api = {
  get: (url: string, token?: { token: string }) => apiFetcher("GET", url, undefined, token?.token),
  post: (url: string, body?: object, token?: { token: string }) =>
    apiFetcher("POST", url, body, token?.token),
  put: (url: string, body?: object, token?: { token: string }) =>
    apiFetcher("PUT", url, body, token?.token),
  patch: (url: string, body?: object, token?: { token: string }) =>
    apiFetcher("PATCH", url, body, token?.token),
  delete: (url: string, token?: { token: string }) =>
    apiFetcher("DELETE", url, undefined, token?.token),
};

export default api;
