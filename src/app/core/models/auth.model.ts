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

export interface LoginValues {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
}

export interface AuthResponse {
  access_token: string | null;
  user: AuthUser;
}

// export interface SignupResponse {
//   message?: string;
//   // أضيفي باقي الحقول المرتجعة حسب الـ API Contract
// }
