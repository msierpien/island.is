import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Auth } from './auth'

// These types are copied from our OpenAPI generated api clients.
type FetchAPI = WindowOrWorkerGlobalScope['fetch']

interface FetchParams {
  url: string
  init: RequestInit
}

interface RequestContext {
  fetch: FetchAPI
  url: string
  init: RequestInit
}

interface Middleware {
  pre?(context: RequestContext): Promise<FetchParams | void>
}

export interface AuthMiddlewareOptions {
  forwardUserInfo: boolean
  tokenExchangeOptions?: TokenExchangeOptions
}

export interface TokenExchangeOptions {
  issuer: string
  clientId: string
  clientSecret: string
  scope: string
}

/**
 * Middleware that adds user authorization and information to OpenAPI Client requests.
 */
export class AuthMiddleware implements Middleware {
  constructor(
    private auth: Auth,
    private options: AuthMiddlewareOptions = {
      forwardUserInfo: true,
    },
    private logger?: Logger,
  ) {}

  async pre(context: RequestContext) {
    let bearerToken = this.auth.authorization

    if (this.options.tokenExchangeOptions) {
      const accessToken = await this.exchangeToken(
        bearerToken.replace('Bearer ', ''),
        this.options.tokenExchangeOptions,
      )

      bearerToken = `Bearer ${accessToken}`
    }

    context.init.headers = Object.assign({}, context.init.headers, {
      authorization: bearerToken,
    })

    if (this.options.forwardUserInfo) {
      context.init.headers = Object.assign({}, context.init.headers, {
        'User-Agent': this.auth.userAgent,
        'X-Real-IP': this.auth.ip,
      })
    }
  }

  private async exchangeToken(
    accessToken: string,
    options: TokenExchangeOptions,
  ): Promise<string> {
    try {
      const response = await fetch(`${options.issuer}/connect/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: options.clientId,
          grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
          scope: options.scope,
          client_secret: options.clientSecret,
          subject_token: accessToken,
          subject_token_type: 'urn:ietf:params:oauth:token-type:access_token',
        }),
      })

      if (!response.ok) {
        this.logError(`Token exchange failed, ${await response.text()}`)
        return ''
      }

      const result = await response.json()

      if (
        result.issued_token_type !=
        'urn:ietf:params:oauth:token-type:access_token'
      ) {
        this.logError(
          `Token exchange failed, invalid issued token type (${result.issued_token_type})`,
        )
        return ''
      }

      if (result.token_type !== 'Bearer') {
        this.logError(
          `Token exchange failed, invalid token type (${result.token_type})`,
        )
        return ''
      }

      return result.access_token
    } catch (error) {
      this.logError('Token exchange failed')
      this.logError(error)
      return ''
    }
  }

  private logError(errorMessage: string) {
    if (this.logger) {
      this.logger.error(errorMessage)
    } else {
      console.log(errorMessage)
    }
  }
}
