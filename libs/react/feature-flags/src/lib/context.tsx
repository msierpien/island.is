import React, { FC, createContext, useContext, useMemo } from 'react'
import {
  createClient,
  FeatureFlagClient,
  FeatureFlagUser,
} from '@island.is/feature-flags'
import { useAuth } from '@island.is/auth/react'

const FeatureFlagContext = createContext<FeatureFlagClient>({
  getValue: (_, defaultValue) => Promise.resolve(defaultValue),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispose() {},
})

export interface FeatureFlagContextProviderProps {
  sdkKey: string
  defaultUser?: FeatureFlagUser
}

export const FeatureFlagProvider: FC<FeatureFlagContextProviderProps> = ({
  children,
  sdkKey,
  defaultUser: userProp,
}) => {
  const { userInfo } = useAuth()
  const featureFlagClient = useMemo(() => {
    return createClient({ sdkKey })
  }, [sdkKey])

  const context = useMemo<FeatureFlagClient>(() => {
    const userAuth =
      userInfo && userInfo.profile.nationalId !== undefined
        ? {
            id: userInfo.profile.nationalId,
            attributes: {
              nationalId: userInfo.profile.nationalId,
            },
          }
        : undefined
    const defaultUser = userProp ?? userAuth

    return {
      getValue(
        key: string,
        defaultValue: boolean | string,
        user: FeatureFlagUser | undefined = defaultUser,
      ) {
        return featureFlagClient.getValue(key, defaultValue, user)
      },
      dispose: () => featureFlagClient.dispose(),
    }
  }, [featureFlagClient, userInfo, userProp])

  return (
    <FeatureFlagContext.Provider value={context}>
      {children}
    </FeatureFlagContext.Provider>
  )
}

type FeatureFlagRecord = Record<string, boolean | string>

export interface MockedFeatureFlagProviderProps {
  flags: string[] | FeatureFlagRecord
}

export const MockedFeatureFlagProvider: FC<MockedFeatureFlagProviderProps> = ({
  flags,
  children,
}) => {
  const context = useMemo<FeatureFlagClient>(() => {
    const cleanFlags = Array.isArray(flags)
      ? flags.reduce<FeatureFlagRecord>((obj, flag) => {
          obj[flag] = true
          return obj
        }, {})
      : flags
    return {
      getValue: async (key, defaultValue) => {
        return cleanFlags[key] ?? defaultValue
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      dispose() {},
    }
  }, [flags])

  return (
    <FeatureFlagContext.Provider value={context}>
      {children}
    </FeatureFlagContext.Provider>
  )
}

export const useFeatureFlagClient = () => {
  return useContext(FeatureFlagContext)
}
