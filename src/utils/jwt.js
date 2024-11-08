import jwt from 'jsonwebtoken';
import config from "../../config.js";
import {AuthenticationError} from "../exception/errorResponse.js";

const createJwt = (payload, lifetime) => {
  const created = Date.now();
  const expired = created + lifetime;

  return { ...payload, created, expired };
};

export const createJwtToken = (payload, lifetime) => jwt.sign(createJwt(payload, lifetime), config.JWT_SECRET);

export const createJwtAccessToken = payload => jwt.sign(createJwt(payload, config.ACCESS_TOKEN_LIFETIME), config.JWT_SECRET);

export const createJwtRefreshToken = payload => jwt.sign(createJwt(payload, config.REFRESH_TOKEN_LIFETIME), config.JWT_REFRESH_SECRET);

export const createJwtTokenPair = payload => ({ accessToken: createJwtAccessToken(payload), refreshToken: createJwtRefreshToken(payload) });

export const verifyJwt = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
      if (err) return reject(err);

      if (decoded.expired < Date.now()) {
        reject(new AuthenticationError('token_expired'));
      }

      return resolve(decoded);
    });
  });

export const verifyTokenEmail = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
      if (err) return reject(err);

      if (decoded.expired < Date.now()) {
        reject(new AuthenticationError('token_expired'));
      }

      return resolve(decoded);
    });
  });

export const verifyRefreshJwt = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) return reject(err);

      if (decoded.expired < Date.now()) {
        reject(new AuthenticationError('token_expired'));
      }

      return resolve(decoded);
    });
  });
