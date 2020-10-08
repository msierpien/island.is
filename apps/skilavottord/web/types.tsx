import { ApolloClient } from 'apollo-client'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'
import { NextComponentType } from 'next'
import { NextPageContext } from 'next/dist/next-server/lib/utils'

export interface MockCar {
  permno: string
  type: string
  newregdate: number
  color: number
  recyclable: boolean
  status?: string
  isCoOwned?: boolean
}

export type GetInitialPropsContext<Context> = Context & {
  apolloClient: ApolloClient<NormalizedCacheObject>
  locale: string
}

export type Screen<Props = {}> = NextComponentType<
  GetInitialPropsContext<NextPageContext>,
  Props,
  Props
>
