import axios from "./axios.customize";
import { User, UserRole } from "../types";

// Types for auth requests/responses
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  data: any;
}

/**
 * Login user and store auth token + user info + role in localStorage
 */
const loginAPI = (credentials: LoginRequest) => {
  const URL_BACKEND = "/login";
  return axios.post(URL_BACKEND, credentials).then((response: any) => {
    // Store token, user info, and role in localStorage
    if (response.data) {
      // Store access token
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
      }
      
      // Store user data
      if (response.data.user) {
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
      }
      
      // Store role separately for quick access
      if (response.data.user && response.data.user.role) {
        localStorage.setItem('user_role', response.data.user.role);
      }
      
      // Store additional user info if needed
      if (response.data.user && response.data.user.departmentId) {
        localStorage.setItem('user_department', response.data.user.departmentId.toString());
      }
    }
    
    return response;
  });
};

/**
 * Register new user
 */
// export const registerAPI = async (userData: RegisterRequest) => {
//   try {
//     const response = await axios.post('/api/auth/register', userData);
//     return response;
//   } catch (error) {
//     console.error('Register error:', error);
//     throw error;
//   }
// };

/**
 * Logout user and clear stored auth data
 */
export const logoutAPI = () => {
  try {
    // Clear all auth-related data from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_department');
    
    // Optional: call backend logout endpoint if exists
    // await axios.post('/api/auth/logout');
    
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = (): User | null => {
  try {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      const user = JSON.parse(userJson);
      // Convert date strings back to Date objects
      if (user.createdAt) {
        user.createdAt = new Date(user.createdAt);
      }
      return user;
    }
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Get stored access token
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem('access_token');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = getAccessToken();
  const user = getCurrentUser();
  return !!(token && user);
};

/**
 * Refresh access token (if your backend supports refresh tokens)
 */
const refreshTokenAPI = () => {
  const URL_BACKEND = "/auth/refresh";
  return axios.post(URL_BACKEND).then((response: any) => {
    if (response.data && response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }
    return response;
  });
};

/**
 * Verify token validity with backend
 */
const verifyTokenAPI = () => {
  const URL_BACKEND = "/auth/verify";
  return axios.get(URL_BACKEND);
};

/**
 * Get user role from localStorage
 */
export const getUserRole = (): UserRole | null => {
  try {
    const role = localStorage.getItem('user_role');
    return role as UserRole | null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};

/**
 * Get user department ID from localStorage
 */
export const getUserDepartment = (): string | null => {
  return localStorage.getItem('user_department');
};

/**
 * Check if user has specific role
 */
export const hasRole = (role: UserRole): boolean => {
  const userRole = getUserRole();
  return userRole === role;
};

/**
 * Check if user is admin
 */
export const isAdmin = (): boolean => {
  return hasRole(UserRole.ADMIN);
};

/**
 * Check if user is manager
 */
export const isManager = (): boolean => {
  return hasRole(UserRole.MANAGER);
};

/**
 * Check if user is staff
 */
export const isStaff = (): boolean => {
  return hasRole(UserRole.STAFF);
};

// Export all functions
export {
  loginAPI,
  refreshTokenAPI,
  verifyTokenAPI
};
