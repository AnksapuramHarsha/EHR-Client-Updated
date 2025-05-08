export interface RegisterRequest {
    username: string;
    password: string;
    networkId: string;
    organizationId: string;
    departmentId: string;
    roles: string[];
  }
  
  export interface LoginRequest {
    username: string;
    password: string;
  }
  
  export interface LoginResponse {
    token: string;
  }
  