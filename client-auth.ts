import * as alt from 'alt-client';

alt.onServer('Auth:RequestToken', requestToken);

async function requestToken(requestId:string, appId: string): Promise<void> {
  alt.Discord
    .requestOAuth2Token(appId)
    .then((token: string) => {
      alt.emitServerRaw(`Auth:ResponseToken${requestId}`, {
        isSuccess: true,
        token
      });
    })
    .catch((error: any) => {
      alt.emitServerRaw(`Auth:ResponseToken${requestId}`, {
        isSuccess: true,
        error
      });
    })
}