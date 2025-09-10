
    interface UserCredentials {
      username: string;
      password: string;
    }

    interface CloudFunctionEvent {
      credentials: UserCredentials;
    }

    interface TokenResponse {
      accessToken: string;
      user: {
        id: string;
        username: string;
        email: string;
      };
    }

    export declare function main(event: CloudFunctionEvent, context: any): Promise<TokenResponse>;
  