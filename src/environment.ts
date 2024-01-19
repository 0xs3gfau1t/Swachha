export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      MAILER_USER: string;
      MAILER_CLIENT_ID: string;
      MAILER_CLIENT_SECRET: string;
      MAILER_REFRESH_TOKEN: string;
      DOMAIN_URL: string;
      ACCESS_TOKEN_SECRET: string;
      NEXTAUTH_SECRET: string;
    }
  }
}
