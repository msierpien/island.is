import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

const MAIN_QUEUE_NAME = 'user-notification'
const DEAD_LETTER_QUEUE_NAME = 'user-notification-failure'

export const userNotificationServiceSetup = (): ServiceBuilder<'user-notification'> =>
  service('user-notification')
    .image('user-notification')
    .namespace('user-notification')
    .serviceAccount('user-notification')
    .command('node')
    .args('main.js')
    .env({
      MAIN_QUEUE_NAME,
      DEAD_LETTER_QUEUE_NAME,
    })
    .liveness('/liveness')
    .readiness('/liveness')

export const userNotificationWorkerSetup = (): ServiceBuilder<'user-notification-worker'> =>
  service('user-notification-worker')
    .image('user-notification-worker')
    .namespace('user-notification')
    .serviceAccount('user-notification-worker')
    .command('node')
    .args('main.js', '--job')
    .env({
      MAIN_QUEUE_NAME,
      DEAD_LETTER_QUEUE_NAME,
    })
    .liveness('/liveness')
    .readiness('/liveness')
