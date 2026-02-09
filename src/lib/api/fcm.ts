import { apiClient } from "./client";

/**
 * FCM 토큰을 서버로 전송
 * @param token FCM 토큰
 */
export const sendFcmToken = async (token: string): Promise<void> => {
  const response = await apiClient.post("/fcm/token", {
    token: token,
  });

  if (!response.data.success) {
    throw new Error(response.data.message || "FCM 토큰 전송 실패");
  }
};
