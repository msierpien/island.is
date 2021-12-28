import { DynamicModule } from '@nestjs/common'
import {
  CaseApi,
  ClientsApi,
  Configuration,
  DocumentApi,
  MemoApi,
  SecurityApi,
} from '../gen/fetch/dev'

import { logger } from '@island.is/logging'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { TokenMiddleware } from './data-protection-complaint-client.middleware'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { CLIENT_CONFIG, DataProtectionComplaintClientConfig } from './config'

const useXroad = !isRunningOnEnvironment('local')

const createProviderConfig = (
  config: DataProtectionComplaintClientConfig,
  middleware?: TokenMiddleware,
): Configuration => {
  return new Configuration({
    fetchApi: createEnhancedFetch({
      name: 'data-protection-complaint-client',
    }),
    basePath: useXroad ? config.xRoadBaseUrl : undefined,
    middleware: middleware ? [middleware] : [],
  })
}

export class ClientsDataProtectionComplaintModule {
  static register(config: DataProtectionComplaintClientConfig): DynamicModule {
    if (!config.xRoadBaseUrl) {
      logger.error('DataProtectionClient xRoadPath not provided.')
    }
    if (!config.password) {
      logger.error('DataProtectionClient password not provided.')
    }
    if (!config.username) {
      logger.error('DataProtectionClient username not provided.')
    }
    if (!config.xRoadClientId) {
      logger.error('DataProtectionClient xRoadClientId not provided.')
    }
    if (!config.XRoadProviderId) {
      logger.error('DataProtectionClient XRoadProviderId not provided.')
    }

    const exportedApis = [
      DocumentApi,
      CaseApi,
      SecurityApi,
      MemoApi,
      ClientsApi,
    ]

    return {
      module: ClientsDataProtectionComplaintModule,
      providers: [
        {
          provide: CLIENT_CONFIG,
          useFactory: () => config,
        },
        {
          provide: SecurityApi,
          useFactory: () => {
            return new SecurityApi(createProviderConfig(config))
          },
        },
        TokenMiddleware,
        ...exportedApis.map((Api) => ({
          provide: Api,
          useFactory: () => {
            return new Api(
              new Configuration({
                fetchApi: createEnhancedFetch({
                  name: 'data-protection-complaint-client',
                }),
                basePath: useXroad ? config.xRoadBaseUrl : undefined,
              }),
            )
          },
        })),
      ],
      exports: [...exportedApis, TokenMiddleware],
    }
  }
}
