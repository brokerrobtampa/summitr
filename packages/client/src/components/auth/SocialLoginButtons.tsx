import { useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext.js';

// Declare global types for OAuth SDKs
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
          }) => void;
          prompt: () => void;
        };
      };
    };
    FB?: {
      init: (config: { appId: string; cookie: boolean; xfbml: boolean; version: string }) => void;
      login: (
        callback: (response: { authResponse?: { accessToken: string } }) => void,
        options: { scope: string },
      ) => void;
    };
    fbAsyncInit?: () => void;
    AppleID?: {
      auth: {
        init: (config: {
          clientId: string;
          scope: string;
          redirectURI: string;
          usePopup: boolean;
        }) => void;
        signIn: () => Promise<{ authorization: { id_token: string } }>;
      };
    };
  }
}

// These are injected at build time from .env or set via server config
const GOOGLE_CLIENT_ID = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || '';
const FACEBOOK_APP_ID = (import.meta as any).env?.VITE_FACEBOOK_APP_ID || '';
const APPLE_CLIENT_ID = (import.meta as any).env?.VITE_APPLE_CLIENT_ID || '';

function loadScript(src: string, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

export function SocialLoginButtons({ onError }: { onError?: (msg: string) => void }) {
  const { loginWithOAuth } = useAuth();
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleError = useCallback((msg: string) => {
    setLoadingProvider(null);
    onError?.(msg);
  }, [onError]);

  // ─── Google ────────────────────────────────────────
  const handleGoogle = useCallback(async () => {
    if (!GOOGLE_CLIENT_ID) {
      handleError('Google login is not configured');
      return;
    }

    setLoadingProvider('google');
    try {
      await loadScript('https://accounts.google.com/gsi/client', 'google-gsi');

      if (!window.google) {
        handleError('Failed to load Google Sign-In');
        return;
      }

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          try {
            await loginWithOAuth('google', response.credential);
          } catch (err: any) {
            handleError(err.message || 'Google login failed');
          }
        },
      });

      window.google.accounts.id.prompt();
    } catch (err: any) {
      handleError(err.message || 'Failed to initialize Google Sign-In');
    }
  }, [loginWithOAuth, handleError]);

  // ─── Facebook ──────────────────────────────────────
  const handleFacebook = useCallback(async () => {
    if (!FACEBOOK_APP_ID) {
      handleError('Facebook login is not configured');
      return;
    }

    setLoadingProvider('facebook');
    try {
      // Set up the callback before loading the SDK
      window.fbAsyncInit = () => {
        window.FB!.init({
          appId: FACEBOOK_APP_ID,
          cookie: true,
          xfbml: false,
          version: 'v19.0',
        });

        window.FB!.login(
          async (response) => {
            if (response.authResponse?.accessToken) {
              try {
                await loginWithOAuth('facebook', response.authResponse.accessToken);
              } catch (err: any) {
                handleError(err.message || 'Facebook login failed');
              }
            } else {
              setLoadingProvider(null);
            }
          },
          { scope: 'email,public_profile' },
        );
      };

      // Check if FB SDK already loaded
      if (window.FB) {
        window.FB.login(
          async (response) => {
            if (response.authResponse?.accessToken) {
              try {
                await loginWithOAuth('facebook', response.authResponse.accessToken);
              } catch (err: any) {
                handleError(err.message || 'Facebook login failed');
              }
            } else {
              setLoadingProvider(null);
            }
          },
          { scope: 'email,public_profile' },
        );
      } else {
        await loadScript('https://connect.facebook.net/en_US/sdk.js', 'facebook-jssdk');
      }
    } catch (err: any) {
      handleError(err.message || 'Failed to initialize Facebook Login');
    }
  }, [loginWithOAuth, handleError]);

  // ─── Apple ─────────────────────────────────────────
  const handleApple = useCallback(async () => {
    if (!APPLE_CLIENT_ID) {
      handleError('Apple login is not configured');
      return;
    }

    setLoadingProvider('apple');
    try {
      await loadScript('https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js', 'apple-auth');

      if (!window.AppleID) {
        handleError('Failed to load Apple Sign-In');
        return;
      }

      window.AppleID.auth.init({
        clientId: APPLE_CLIENT_ID,
        scope: 'name email',
        redirectURI: window.location.origin,
        usePopup: true,
      });

      const response = await window.AppleID.auth.signIn();
      await loginWithOAuth('apple', response.authorization.id_token);
    } catch (err: any) {
      if (err.error === 'popup_closed_by_user') {
        setLoadingProvider(null);
        return;
      }
      handleError(err.message || 'Apple login failed');
    }
  }, [loginWithOAuth, handleError]);

  const hasAnyProvider = GOOGLE_CLIENT_ID || FACEBOOK_APP_ID || APPLE_CLIENT_ID;

  if (!hasAnyProvider) return null;

  return (
    <div className="space-y-2.5">
      {/* Google */}
      {GOOGLE_CLIENT_ID && (
        <button
          onClick={handleGoogle}
          disabled={loadingProvider !== null}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loadingProvider === 'google' ? (
            <Spinner />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          )}
          Continue with Google
        </button>
      )}

      {/* Facebook */}
      {FACEBOOK_APP_ID && (
        <button
          onClick={handleFacebook}
          disabled={loadingProvider !== null}
          className="w-full flex items-center justify-center gap-3 bg-[#1877F2] rounded-lg px-4 py-2.5 text-sm font-medium text-white hover:bg-[#166FE5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loadingProvider === 'facebook' ? (
            <Spinner light />
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          )}
          Continue with Facebook
        </button>
      )}

      {/* Apple */}
      {APPLE_CLIENT_ID && (
        <button
          onClick={handleApple}
          disabled={loadingProvider !== null}
          className="w-full flex items-center justify-center gap-3 bg-black rounded-lg px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loadingProvider === 'apple' ? (
            <Spinner light />
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
          )}
          Continue with Apple
        </button>
      )}

      {/* Divider */}
      <div className="relative mt-4 mb-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-white text-gray-400 uppercase tracking-wider">or</span>
        </div>
      </div>
    </div>
  );
}

function Spinner({ light }: { light?: boolean }) {
  return (
    <svg className={`w-5 h-5 animate-spin ${light ? 'text-white/70' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
