import { ref, service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (services: {
  api: ServiceBuilder<'skilavottord-ws'>
}): ServiceBuilder<'skilavottord-web'> =>
  service('skilavottord-web')
    .namespace('skilavottord')
    .liveness('/liveness')
    .readiness('/liveness')
    .env({
      API_URL: ref((h) => `http://${h.svc(services.api)}`),
    })
    .secrets({
      IDENTITY_SERVER_DOMAIN: '/k8s/skilavottord/web/IDENTITY_SERVER_DOMAIN',
      IDENTITY_SERVER_CLIENT_SECRET:
        '/k8s/skilavottord/web/IDENTITY_SERVER_CLIENT_SECRET',
      IDENTITY_SERVER_LOGOUT_REDIRECT_URL:
        '/k8s/skilavottord/web/IDENTITY_SERVER_LOGOUT_REDIRECT_URL',
      NEXTAUTH_URL: '/k8s/skilavottord/web/NEXTAUTH_URL',
    })
    .ingress({
      primary: {
        host: {
          dev: ['beta'],
          staging: ['beta'],
          prod: ['', 'www.island.is'],
        },
        paths: ['/app/skilavottord/'],
      },
    })
    .grantNamespaces('nginx-ingress-external')
