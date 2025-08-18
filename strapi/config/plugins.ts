export default ({ env }) => ({
  'users-permissions': {
    config: {
      jwt: {
        expiresIn: '30d',
      },
      grant: {
        successRedirect: `${env('CLIENT_URL')}/zh/auth/callback`,
        failureRedirect: `${env('CLIENT_URL')}/zh/auth/callback`,
      },
      providers: {
        wechat: {
          enabled: true,
          key: env('WECHAT_APP_ID'),
          secret: env('WECHAT_APP_SECRET'),
          callback: '/api/connect/wechat/callback',
          redirectUri: `${env('CLIENT_URL')}/zh/auth/callback`,
        },
        qq: {
          enabled: true,
          key: env('QQ_APP_ID'),
          secret: env('QQ_APP_SECRET'),
          callback: '/api/connect/qq/callback',
          redirectUri: `${env('CLIENT_URL')}/zh/auth/callback`,
        },
      },
    },
  },
});
