import { defineMessages } from 'react-intl'

export const locationAndPurpose = {
  general: defineMessages({
    title: {
      id: 'an.application:locationAndPurpose.general.title',
      defaultMessage: 'Staðsetning og tilgangur',
      description: 'Location and purpose',
    },
    description: {
      id: 'an.application:locationAndPurpose.general.description',
      defaultMessage:
        'Vinsamlegast skráðu staðsetninguna þar sem atvikið átti sér stað og gefðu stutta lýsingu á hvers vegna þú varst þar.',
      description: `Please list the location where the incident took place and give a brief description of why you were there.`,
    },
  }),
  labels: defineMessages({
    location: {
      id: 'an.application:locationAndPurpose.labels.descriptionField',
      defaultMessage: 'Staðsetning / póstfang',
      description: `Location / email`,
    },
    postalCode: {
      id: 'an.application:locationAndPurpose.labels.postalCode',
      defaultMessage: 'Póstnúmer',
      description: 'Postal code',
    },
    city: {
      id: 'an.application:locationAndPurpose.labels.city',
      defaultMessage: 'Sveitarfélag',
      description: 'City',
    },
    purpose: {
      id: 'an.application:locationAndPurpose.labels.purpose',
      defaultMessage: 'Í hvaða tilgangi varstu þar?',
      description: 'What purpose were you there for?',
    },
  }),
  placeholder: defineMessages({
    purpose: {
      id: 'an.application:locationAndPurpose.placeholder.purpose',
      defaultMessage: 'Stutt lýsing',
      description: `Short description`,
    },
  }),
}
