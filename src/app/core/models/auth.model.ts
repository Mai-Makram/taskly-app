// 1. Form values from the UI
export interface SignupFormValue {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  jobTitle?: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  data: {
    name: string;
    job_title?: string | null | undefined;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
}

export interface AuthResponse {
  // access_token: string | null;
  // refresh_token: string;
  // expires_in?: number;
  // user: AuthUser;
  access_token: string;
  refresh_token: string;
  expires_in?: number;
  expires_at?: number;
  user: AuthUser;
}

// export interface SignupResponse {
//   message?: string;
//   // أضيفي باقي الحقول المرتجعة حسب الـ API Contract
// }
