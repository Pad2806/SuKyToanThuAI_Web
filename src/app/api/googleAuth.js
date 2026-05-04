/**
 * Google OAuth2 helper — lấy access token từ user để tạo Google Slides.
 * Dùng Google Identity Services (GIS) Token Model.
 */

const GOOGLE_CLIENT_ID = "589974733419-meco3fskiuihped7qgubgbu36m6ds36c.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/presentations https://www.googleapis.com/auth/drive.file";

let tokenClient = null;
let currentAccessToken = null;

/**
 * Lấy Google access token từ user.
 * Nếu chưa đăng nhập → hiện popup Google Sign-In.
 * Nếu đã có token → trả luôn.
 *
 * @returns {Promise<string>} access_token
 */
export function getGoogleAccessToken() {
  return new Promise((resolve, reject) => {
    // Nếu đã có token → trả luôn
    if (currentAccessToken) {
      resolve(currentAccessToken);
      return;
    }

    // Đợi GIS library load
    if (!window.google?.accounts?.oauth2) {
      reject(new Error("Google Identity Services chưa load. Refresh trang và thử lại."));
      return;
    }

    // Tạo token client
    if (!tokenClient) {
      tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: SCOPES,
        callback: (response) => {
          if (response.error) {
            reject(new Error(response.error_description || response.error));
            return;
          }
          currentAccessToken = response.access_token;
          // Token hết hạn sau 1 giờ
          setTimeout(() => { currentAccessToken = null; }, 3500 * 1000);
          resolve(response.access_token);
        },
      });
    }

    // Hiện popup đăng nhập Google
    tokenClient.requestAccessToken();
  });
}

/**
 * Xóa token (logout Google).
 */
export function clearGoogleToken() {
  if (currentAccessToken && window.google?.accounts?.oauth2) {
    window.google.accounts.oauth2.revoke(currentAccessToken);
  }
  currentAccessToken = null;
  tokenClient = null;
}

/**
 * Kiểm tra đã có token chưa.
 */
export function hasGoogleToken() {
  return !!currentAccessToken;
}
