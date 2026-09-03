declare namespace fb {
  interface AuthResponse {
    accessToken?: string;
    expiresIn?: number;
    signedRequest?: string;
    userID?: string;
    code?: string;
  }

  interface StatusResponse {
    status: "connected" | "not_authorized" | "unknown";
    authResponse: AuthResponse | null;
  }

  interface InitParams {
    appId: string;
    version: string;
    cookie?: boolean;
    status?: boolean;
    xfbml?: boolean;
    frictionlessRequests?: boolean;
    hideFlashCallback?: boolean;
    autoLogAppEvents?: boolean;
  }

  interface LoginOptions {
    auth_type?: string;
    scope?: string;
    return_scopes?: boolean;
    enable_profile_selector?: boolean;
    profile_selector_ids?: string;
    config_id?: string;
    response_type?: "code" | "token" | "code%20token";
    override_default_response_type?: boolean;
    extras?: {
      setup?: Record<string, any>;
      featureType?: string;
      sessionInfoVersion?: string | number;
      features?: Array<{ name: string }>;
      version?: string;
    };
  }
}

interface Window {
  FB?: {
    init(params: fb.InitParams): void;
    login(callback: (response: fb.StatusResponse) => void, options?: fb.LoginOptions): void;
    getLoginStatus(callback: (response: fb.StatusResponse) => void, roundtrip?: boolean): void;
    logout(callback?: (response: fb.StatusResponse) => void): void;
    _initialized?: boolean;
    AppEvents?: {
      logPageView(): void;
      logEvent(eventName: string, valueToSum?: number, parameters?: Record<string, any>): void;
    };
  };
  fbAsyncInit?: () => void;
}

export interface MetaWhatsAppEmbeddedSignupEventData {
  type: "WA_EMBEDDED_SIGNUP";
  event?: "FINISH" | "CANCEL" | "ERROR";
  data?: {
    phone_number_id?: string;
    waba_id?: string;
    current_step?: string;
    code?: string;
  };
}
