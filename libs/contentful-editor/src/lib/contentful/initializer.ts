import mitt from 'mitt'
import type { Emitter, Handler } from 'mitt'
import { ContentType } from 'contentful-management/dist/typings/entities/content-type'
import { Space } from 'contentful-management/dist/typings/entities/space'
import { Collection } from 'contentful-management/dist/typings/common-types'
import {
  Entry,
  EntryProp,
} from 'contentful-management/dist/typings/entities/entry'
import {
  BaseExtensionSDK,
  FieldAPI,
} from 'contentful-ui-extensions-sdk/typings'
import { ContentFields } from 'contentful-management/dist/typings/entities/content-type-fields'

import { ContentfulEnv, createContentfulClient } from '../contentful/client'
import { getSdk } from '../contentful/sdk'

type _Entry = Collection<Entry, EntryProp>
type _Locale = 'en' | 'is-IS'

interface InitializerProps {
  slug: string
  contentType: string
  locale: _Locale
  env: ContentfulEnv
}


export interface MagicType {
  _entry: _Entry
  _space: Space
  _type: ContentType
  _sdk: any // TODO
  fields: FieldAPI[]
}

export const initializer = async ({
  slug,
  contentType,
  locale,
  env,
}: InitializerProps) => {
  const { env: client, space } = await createContentfulClient(env)

  // We get the entry content
  const entry = await client.getEntries({
    content_type: contentType,
    'fields.slug': slug,
    locale,
  })
  console.log('-entry', entry);

  // We get the entry contentType
  const type = await client.getContentType(contentType)
  console.log('-type', type);

  // We get the data for SDK
  const sdk = getSdk(space, type)

  // We merge both objects together to fit the contentful fields API
  const fields = type.fields
    .map((field) => {
      const emitter: Emitter = mitt()

      return {
        id: field.id,
        locale,
        type: field.type,
        required: field.required,
        validations: field.validations,
        items: field.items,
        getValue: () => {
          const entryFields = entry.items?.[0].fields
          const fieldName = Object.keys(entryFields).find(
            (entryField) => entryField === field.id,
          )

          if (!fieldName) {
            return undefined
          }

          return entryFields?.[fieldName]?.[locale]
        },
        setValue: (value: string) => {
          emitter.emit('setValue', value)
          emitter.emit('onValueChanged', value)

          return Promise.resolve()
        },
        removeValue: () => {
          emitter.emit('removeValue')
          emitter.emit('onValueChanged', undefined)

          return Promise.resolve()
        },
        setInvalid: () => {
          emitter.emit('setInvalid')
        },
        onValueChanged: (...args: [string, Function] | [Function]) => {
          let fn: Function

          if (typeof args[0] === 'string') {
            fn = args[1] as Function
          } else {
            fn = args[0]
          }

          emitter.on('onValueChanged', fn as Handler)

          return () => {
            emitter.off('onValueChanged', fn as Handler)
          }
        },
        onIsDisabledChanged: (fn: Function) => {
          emitter.on('onIsDisabledChanged', fn as Handler)

          return () => {
            emitter.off('onIsDisabledChanged', fn as Handler)
          }
        },
        onSchemaErrorsChanged: (fn: Function) => {
          emitter.on('onSchemaErrorsChanged', fn as Handler)

          return () => {
            emitter.off('onSchemaErrorsChanged', fn as Handler)
          }
        },
      }
    })

  // We return the original objects + our modified object
  return {
    _entry: entry,
    _type: type,
    _space: space,
    _sdk: sdk,
    fields,
  }
}
