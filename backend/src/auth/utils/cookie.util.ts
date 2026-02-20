import { Response } from "express";

const REFRESH_COOKIE_NAME = "refreshToken";

// 7 days in milliseconds
const REFRESH_TOKEN_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

/**
 * Sets the refresh token as a secure httpOnly cookie on the response.
 * @param res - Express response object.
 * @param token - The signed refresh token string.
 */
export const setRefreshTokenCookie = (res: Response, token: string): void => {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true, // not accessible via JS
    secure: process.env.NODE_ENV === "production", // HTTPS only in prod
    sameSite: "strict", // CSRF protection
    maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE,
  });
};

/**
 * Clears the refresh token cookie from the response.
 * @param res - Express response object.
 */
export const clearRefreshTokenCookie = (res: Response): void => {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
};

export { REFRESH_COOKIE_NAME };
