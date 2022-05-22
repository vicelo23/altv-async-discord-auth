import * as alt from 'alt-server';
import crypto from 'crypto';
import axios, { AxiosResponse } from 'axios';

type ResponseSuccess = {
  isSuccess: true;
  token: string;
}

type ResponseFailure = {
  isSuccess: false;
  error: any;
}

export type DiscordUser = {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  bot?: boolean;
  system?: boolean;
  mfa_enabled?: boolean;
  banner?: string | null;
  accent_color?: number | null;
  locale?: string;
  flags?: number;
  premium_type?: number;
  public_flags?: number;
}

interface GetUserResponse extends AxiosResponse {
  data: DiscordUser;
}

function getUser(token: string): Promise<DiscordUser> {
  return new Promise<DiscordUser>(async (resolve, reject) => {
    try {
      const response: GetUserResponse = await axios.get('https://discord.com/api/v9/users/@me', {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`
        }
      })

      resolve(response.data);
    } catch (err: any) {
      reject(err);
    }
  })
}

export function startAuth(player: alt.Player, appId: string): Promise<DiscordUser> {
  return new Promise<DiscordUser>((resolve, reject) => {
    if (!player && !appId) return reject(new Error('Player or appId is invalid.'));

    const requestId: string = crypto.randomBytes(16).toString('hex');

    alt.onClient(`Auth:ResponseToken${requestId}`, responseToken);
    player.emitRaw('Auth:RequestToken', requestId, appId);

    const timeout = setTimeout(() => {
      alt.offClient(`Auth:ResponseToken${requestId}`, responseToken);
      return reject(new Error('User did not respond to the request.'));
    }, 15000);

    async function responseToken(player: alt.Player, response: ResponseSuccess | ResponseFailure) {
      clearTimeout(timeout);
      alt.offClient(`Auth:ResponseToken${requestId}`, responseToken);
      if (!response.isSuccess) {
        reject(response.error);
        return;
      }

      try {
        const user = await getUser(response.token);
        resolve(user);
      } catch (err) {
        reject(err);
      }
    }
  })
}