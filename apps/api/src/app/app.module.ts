import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { TerminusModule } from '@nestjs/terminus'
import responseCachePlugin from 'apollo-server-plugin-response-cache'

import { AuthModule as AuthDomainModule } from '@island.is/api/domains/auth'
import { ContentSearchModule } from '@island.is/api/domains/content-search'
import { CmsModule } from '@island.is/cms'
import { DrivingLicenseModule } from '@island.is/api/domains/driving-license'
import { EducationModule } from '@island.is/api/domains/education'
import { ApplicationModule } from '@island.is/api/domains/application'
import { DirectorateOfLabourModule } from '@island.is/api/domains/directorate-of-labour'
import { FileUploadModule } from '@island.is/api/domains/file-upload'
import { DocumentModule } from '@island.is/api/domains/documents'
import { CommunicationsModule } from '@island.is/api/domains/communications'
import { CmsTranslationsModule } from '@island.is/cms-translations'
import { UserProfileModule } from '@island.is/api/domains/user-profile'
import { NationalRegistryModule } from '@island.is/api/domains/national-registry'
import { HealthInsuranceModule } from '@island.is/api/domains/health-insurance'
import { IdentityModule } from '@island.is/api/domains/identity'
import { AuthModule } from '@island.is/auth-nest-tools'
import { HealthController } from './health.controller'
import { getConfig } from './environments'
import { ApiCatalogueModule } from '@island.is/api/domains/api-catalogue'
import { DocumentProviderModule } from '@island.is/api/domains/document-provider'
import { SyslumennModule } from '@island.is/api/domains/syslumenn'
import { RSKModule } from '@island.is/api/domains/rsk'
import { IcelandicNamesModule } from '@island.is/api/domains/icelandic-names-registry'
import { RegulationsModule } from '@island.is/api/domains/regulations'
import { FinanceModule } from '@island.is/api/domains/finance'
import { AssetsModule } from '@island.is/api/domains/assets'
import { EndorsementSystemModule } from '@island.is/api/domains/endorsement-system'
import { NationalRegistryXRoadModule } from '@island.is/api/domains/national-registry-x-road'
import { ApiDomainsPaymentModule } from '@island.is/api/domains/payment'
import { LicenseServiceModule } from '@island.is/api/domains/license-service'
import { IslykillModule } from '@island.is/api/domains/islykill'
import { PaymentScheduleModule } from '@island.is/api/domains/payment-schedule'
import { NationalRegistryClientConfig } from '@island.is/clients/national-registry-v2'
import { AuditModule } from '@island.is/nest/audit'
import { ConfigModule, XRoadConfig } from '@island.is/nest/config'
import { ProblemModule } from '@island.is/nest/problem'
import { CriminalRecordModule } from '@island.is/api/domains/criminal-record'

import { maskOutFieldsMiddleware } from './graphql.middleware'
import { AuthPublicApiClientConfig } from '@island.is/clients/auth-public-api'

const debug = process.env.NODE_ENV === 'development'
const playground = debug || process.env.GQL_PLAYGROUND_ENABLED === 'true'
const environment = getConfig
const autoSchemaFile = environment.production
  ? true
  : 'apps/api/src/api.graphql'

@Module({
  controllers: [HealthController],
  imports: [
    GraphQLModule.forRoot({
      debug,
      playground,
      autoSchemaFile,
      path: '/api/graphql',
      buildSchemaOptions: {
        fieldMiddleware: [maskOutFieldsMiddleware],
      },
      plugins: [
        responseCachePlugin({
          shouldReadFromCache: ({
            request: {
              http: { headers },
            },
          }) => {
            const bypassCacheKey = headers.get('bypass-cache-key')
            return bypassCacheKey !== process.env.BYPASS_CACHE_KEY
          },
        }),
      ],
    }),
    AuthDomainModule,
    AuditModule.forRoot(environment.audit),
    ContentSearchModule,
    CmsModule,
    DrivingLicenseModule.register({
      clientConfig: {
        xroadBaseUrl: environment.xroad.baseUrl,
        xroadClientId: environment.xroad.clientId,
        secret: environment.drivingLicense.secret,
        xroadPathV1: environment.drivingLicense.v1.xroadPath,
        xroadPathV2: environment.drivingLicense.v2.xroadPath,
      },
    }),
    EducationModule.register({
      xroad: {
        baseUrl: environment.xroad.baseUrl,
        clientId: environment.xroad.clientId,
        services: {
          license: environment.education.xroadLicenseServiceId,
          grade: environment.education.xroadGradeServiceId,
        },
      },
      nationalRegistry: {
        baseSoapUrl: environment.nationalRegistry.baseSoapUrl,
        user: environment.nationalRegistry.user,
        password: environment.nationalRegistry.password,
        host: environment.nationalRegistry.host,
      },
      fileDownloadBucket: environment.education.fileDownloadBucket,
    }),
    ApplicationModule.register({
      baseApiUrl: environment.applicationSystem.baseApiUrl,
    }),
    DirectorateOfLabourModule.register(),
    FileUploadModule.register({ fileStorage: environment.fileStorage }),
    DocumentModule.register({
      documentClientConfig: {
        basePath: environment.documentService.basePath,
        clientId: environment.documentService.clientId,
        clientSecret: environment.documentService.clientSecret,
        tokenUrl: environment.documentService.tokenUrl,
      },
      downloadServiceConfig: {
        downloadServiceBaseUrl: environment.downloadService.baseUrl,
      },
    }),
    DocumentProviderModule.register({
      test: {
        basePath: environment.documentProviderService.test.basePath,
        clientId: environment.documentProviderService.test.clientId,
        clientSecret: environment.documentProviderService.test.clientSecret,
        tokenUrl: environment.documentProviderService.test.tokenUrl,
      },
      prod: {
        basePath: environment.documentProviderService.prod.basePath,
        clientId: environment.documentProviderService.prod.clientId,
        clientSecret: environment.documentProviderService.prod.clientSecret,
        tokenUrl: environment.documentProviderService.prod.tokenUrl,
      },
      documentsServiceBasePath:
        environment.documentProviderService.documentsServiceBasePath,
      documentProviderAdmins:
        environment.documentProviderService.documentProviderAdmins,
    }),
    CmsTranslationsModule,
    TerminusModule,
    NationalRegistryModule.register({
      nationalRegistry: {
        baseSoapUrl: environment.nationalRegistry.baseSoapUrl,
        user: environment.nationalRegistry.user,
        password: environment.nationalRegistry.password,
        host: environment.nationalRegistry.host,
      },
    }),
    HealthInsuranceModule.register({
      soapConfig: {
        wsdlUrl: environment.healthInsurance.wsdlUrl,
        baseUrl: environment.healthInsurance.baseUrl,
        username: environment.healthInsurance.username,
        password: environment.healthInsurance.password,
        clientID: environment.healthInsurance.clientID,
        xroadID: environment.healthInsurance.xroadID,
      },
      clientV2Config: {
        xRoadBaseUrl: environment.healthInsuranceV2.xRoadBaseUrl,
        xRoadProviderId: environment.healthInsuranceV2.xRoadProviderId,
        xRoadClientId: environment.healthInsuranceV2.xRoadClientId,
        username: environment.healthInsuranceV2.username,
        password: environment.healthInsuranceV2.password,
      },
    }),
    UserProfileModule.register({
      userProfileServiceBasePath:
        environment.userProfile.userProfileServiceBasePath,
      islykill: {
        cert: environment.islykill.cert,
        passphrase: environment.islykill.passphrase,
        basePath: environment.islykill.basePath,
      },
    }),
    CommunicationsModule,
    ApiCatalogueModule,
    IdentityModule,
    AuthModule.register(environment.auth),
    SyslumennModule.register({
      url: environment.syslumennService.url,
      username: environment.syslumennService.username,
      password: environment.syslumennService.password,
    }),
    RSKModule.register({
      password: environment.rskDomain.password,
      url: environment.rskDomain.url,
      username: environment.rskDomain.username,
    }),
    IcelandicNamesModule.register({
      backendUrl: environment.icelandicNamesRegistry.backendUrl,
    }),
    EndorsementSystemModule.register({
      baseApiUrl: environment.endorsementSystem.baseApiUrl,
    }),
    RegulationsModule.register({
      url: environment.regulationsDomain.url,
    }),
    FinanceModule.register({
      ttl: environment.fjarmalDomain.ttl,
      downloadServiceBaseUrl: environment.downloadService.baseUrl,
      xroadApiPath: environment.fjarmalDomain.xroadApiPath,
      xroadBaseUrl: environment.xroad.baseUrl,
      xroadClientId: environment.xroad.clientId,
    }),
    AssetsModule.register({
      xRoadBasePathWithEnv: environment.propertiesXRoad.url,
      xRoadAssetsMemberCode: environment.propertiesXRoad.memberCode,
      xRoadAssetsApiPath: environment.propertiesXRoad.apiPath,
      xRoadClientId: environment.propertiesXRoad.clientId,
    }),
    NationalRegistryXRoadModule,
    ApiDomainsPaymentModule.register({
      xRoadProviderId: environment.paymentDomain.xRoadProviderId,
      xRoadBaseUrl: environment.paymentDomain.xRoadBaseUrl,
      xRoadClientId: environment.xroad.clientId,
      password: environment.paymentDomain.password,
      username: environment.paymentDomain.username,
      callbackBaseUrl: environment.paymentDomain.callbackBaseUrl,
      callbackAdditionUrl: environment.paymentDomain.callbackAdditionUrl,
      arkBaseUrl: environment.paymentDomain.arkBaseUrl,
    }),
    LicenseServiceModule.register({
      xroad: {
        baseUrl: environment.xroad.baseUrl,
        clientId: environment.xroad.clientId,
        path: environment.drivingLicense.v1.xroadPath,
        secret: environment.drivingLicense.secret,
      },
      pkpass: {
        apiKey: environment.pkpass.apiKey,
        apiUrl: environment.pkpass.apiUrl,
        secretKey: environment.pkpass.secretKey,
        cacheKey: environment.pkpass.cacheKey,
        cacheTokenExpiryDelta: environment.pkpass.cacheTokenExpiryDelta,
        authRetries: environment.pkpass.authRetries,
      },
    }),
    PaymentScheduleModule.register({
      xRoadProviderId: environment.paymentSchedule.xRoadProviderId,
      xRoadBaseUrl: environment.paymentSchedule.xRoadBaseUrl,
      xRoadClientId: environment.xroad.clientId,
      password: environment.paymentSchedule.password,
      username: environment.paymentSchedule.username,
    }),
    IslykillModule.register({
      cert: environment.islykill.cert,
      passphrase: environment.islykill.passphrase,
      basePath: environment.islykill.basePath,
    }),
    ProblemModule,
    CriminalRecordModule.register({
      clientConfig: {
        xroadBaseUrl: environment.xroad.baseUrl,
        xroadClientId: environment.xroad.clientId,
        xroadPath: environment.criminalRecord.xroadPath,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        XRoadConfig,
        NationalRegistryClientConfig,
        AuthPublicApiClientConfig,
      ],
    }),
  ],
})
export class AppModule {}
