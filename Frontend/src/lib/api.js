
import { toast } from "@/hooks/use-toast";

const getApiUrl = () => {
  // Use the environment variable for the production API URL.
  // Fallback to the local backend URL for development.
  return "https://knowable-backend-latest.onrender.com"; 
};
const handleResponse = async (response) => {
  if (response.ok) {
    try {
        const text = await response.text();
        return text ? JSON.parse(text) : {};
    } catch (e) {
        // The response was successful, but didn't have a JSON body.
        return {};
    }
  } else {
    let errorMessage = `An error occurred: ${response.statusText}`;
    
    try {
        const responseText = await response.text();
        if (responseText) {
            const errorData = JSON.parse(responseText);
            // Safely extract a simple string message and avoid stringifying the whole object
            if (typeof errorData.message === 'string') {
                errorMessage = errorData.message;
            } else if (typeof errorData.error === 'string') {
                errorMessage = errorData.error;
            }
        }
    } catch (e) {
        // If parsing the error response fails, we'll stick with the default status text message.
        // This is safer than trying to process a complex, non-JSON error.
        console.error("Could not parse API error response as JSON. Falling back to status text.");
    }

    toast({
        variant: "destructive",
        title: `API Error (Status: ${response.status})`,
        description: errorMessage,
    });
    
    throw new Error(errorMessage);
  }
};

const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
}

const getHeaders = (isFormData = false) => {
    const headers = {};
    const token = getAuthToken();

    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
}

export const api = {
  get: async (endpoint) => {
    const response = await fetch(`${getApiUrl()}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  post: async (endpoint, body) => {
    const isFormData = body instanceof FormData;
    const response = await fetch(`${getApiUrl()}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(isFormData),
      body: isFormData ? body : JSON.stringify(body),
    });
    return handleResponse(response);
  },
  put: async (endpoint, body) => {
    const isFormData = body instanceof FormData;
    const response = await fetch(`${getApiUrl()}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(isFormData),
      body: isFormData ? body : JSON.stringify(body),
    });
    return handleResponse(response);
  },
  patch: async (endpoint, body) => {
    const isFormData = body instanceof FormData;
    const response = await fetch(`${getApiUrl()}${endpoint}`, {
        method: 'PATCH',
        headers: getHeaders(isFormData),
        body: isFormData ? body : JSON.stringify(body),
    });
    return handleResponse(response);
  },
  delete: async (endpoint) => {
    const response = await fetch(`${getApiUrl()}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};
