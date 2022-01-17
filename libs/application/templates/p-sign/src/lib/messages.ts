import { defineMessages } from 'react-intl'

export const m = defineMessages({
  applicationTitle: {
    id: 'ps.application:applicationTitle',
    defaultMessage: 'Umsókn um P-Merki',
    description: 'Application for P-Sign',
  },
  /* Data Collection Section */
  dataCollectionTitle: {
    id: 'ps.application:applicationDataCollectionTitle',
    defaultMessage: 'Gagnaöflun',
    description: 'Title for data collection section',
  },
  dataCollectionSubtitle: {
    id: 'ps.application:dataCollectionSubtitle',
    defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt með þínu samþykki',
    description: 'Subtitle for data collection section',
  },
  dataCollectionDescription: {
    id: 'ps.application:dataCollectionDescription',
    defaultMessage:
      'Svo hægt sé að afgreiða umsókn þína um stæðiskort, þarf að sækja eftirfarandi gögn með þínu samþykki.',
    description: 'Description for data collection section',
  },
  dataCollectionCheckboxLabel: {
    id: 'ps.application:dataCollectionCheckboxLabel',
    defaultMessage: 'Ég samþykki að láta sækja gögn',
    description: 'Checkbox label for data collection section',
  },
  dataCollectionDoctorsNoteTitle: {
    id: 'ps.application:dataCollectionDoctorsNoteTitle',
    defaultMessage: 'Læknisvottorð vegna umsóknar um stæðiskort',
    description: 'Doctors note title',
  },
  dataCollectionDoctorsNoteSubtitle: {
    id: 'ps.application:dataCollectionDoctorsNoteLabel',
    defaultMessage:
      'Rafrænt læknisvottorð frá heimilislækni, þar sem tilgreindur er gildistími stæðiskorts.',
    description: 'Doctors note subtitle',
  },
  dataCollectionNationalRegistryTitle: {
    id: 'ps.application:dataCollectionNationalRegistryTitle',
    defaultMessage: 'Uppfletting í Þjóðskrá',
    description: 'National registry title',
  },
  dataCollectionNationalRegistrySubtitle: {
    id: 'ps.application:dataCollectionNationalRegistrySubtitle',
    defaultMessage: 'Fullt nafn, kennitala, heimilisfang.',
    description: 'National registry subtitle',
  },
  dataCollectionQualityPhotoTitle: {
    id: 'ps.application:dataCollectionQualityPhotoTitle',
    defaultMessage: 'Upplýsingar úr ökuskírteinaskrá (ef við á)',
    description: 'Info from drivers license',
  },
  dataCollectionQualityPhotoSubtitle: {
    id: 'ps.application:dataCollectionQualityPhotoSubtitle',
    defaultMessage: 'Mynd er sótt úr ökuskírteinakerfi.',
    description: 'National registry subtitle',
  },
  dataCollectionUserProfileTitle: {
    id: 'cr.application:dataCollectionUserProfileTitle',
    defaultMessage: 'Mínar síður á Ísland.is/stillingar',
    description: 'Your user profile information',
  },
  dataCollectionUserProfileSubtitle: {
    id: 'ps.application:dataCollectionUserProfileSubtitle',
    defaultMessage:
      'Ef þú ert með skráaðar upplýsingar um síma og netfang á Mínum Síðum inná Ísland.is kemur það sjálfkrafa í umsókn þína.',
    description:
      'In order to apply for this application we need your email and phone number',
  },

  /* Information Section */
  informationTitle: {
    id: 'ps.application:informationSectionTitle',
    defaultMessage:
      'Persónuupplýsingar umsækjanda, vegna umsóknar um stæðiskort',
    description: 'Information section title',
  },
  informationSectionTitle: {
    id: 'ps.application:informationTitle',
    defaultMessage: 'Upplýsingar',
    description: 'Information title',
  },

  /* Applicant - used in information and overview sections */
  applicantsName: {
    id: 'ps.application:applicantsName',
    defaultMessage: 'Nafn',
    description: 'Name label',
  },
  applicantsNationalId: {
    id: 'ps.application:applicantsNationalId',
    defaultMessage: 'Kennitala',
    description: 'National id label',
  },
  applicantsAddress: {
    id: 'ps.application:applicantsAddress',
    defaultMessage: 'Heimilisfang',
    description: 'Address label',
  },
  applicantsCity: {
    id: 'ps.application:applicantsCity',
    defaultMessage: 'Staður',
    description: 'City label',
  },
  applicantsEmail: {
    id: 'ps.application:applicantsEmail',
    defaultMessage: 'Netfang',
    description: 'Email label',
  },
  applicantsPhoneNumber: {
    id: 'ps.application:applicantsPhoneNumber',
    defaultMessage: 'Símanúmer',
    description: 'Phone number label',
  },
  cardValidityPeriod: {
    id: 'ps.application:cardValidityPeriod',
    defaultMessage: 'Gildistími',
    description: 'Card validity label',
  },

  /* Quality Photo Section */
  qualityPhotoTitle: {
    id: 'ps.application:qualityPhotoSectionTitle',
    defaultMessage: 'Mynd í stæðiskort',
    description: 'Title for quality photo section',
  },
  qualityPhotoSectionTitle: {
    id: 'ps.application:qualityPhotoSectionTitle',
    defaultMessage: 'Mynd',
    description: 'Title for quality photo section',
  },
  qualityPhotoExistingPhotoText: {
    id: 'ps.application:qualityPhotoExistingPhotoText',
    defaultMessage:
      'Hér er núverandi mynd úr ökuskírteinaskrá. Hægt er að nota hana eða hlaða inn nýrri mynd með tilgreindum skilyrðum hér fyrir neðan.',
    description: `Text for the user's existing quality photo`,
  },
  qualityPhotoUseExistingPhoto: {
    id: 'ps.application:qualityPhotoUseExistingPhoto',
    defaultMessage: 'Nota núverandi mynd',
    description: `Text for the user's existing quality photo`,
  },
  qualityPhotoUploadNewPhoto: {
    id: 'ps.application:qualityPhotoUploadNewPhoto',
    defaultMessage: 'Hlaða inn mynd',
    description: `Text for uploading a new photo`,
  },
  qualityPhotoFileUploadTitle: {
    id: 'ps.application:qualityPhotoFileUploadTitle',
    defaultMessage: 'Dragðu mynd hingað til að hlaða upp',
    description: `Title for file upload`,
  },
  qualityPhotoFileUploadDescription: {
    id: 'ps.application:qualityPhotoFileUploadDescription',
    defaultMessage: 'Tekið er við mynd með endingu: .jpeg, .png, .jpg',
    description: `Description for file upload`,
  },
  qualityPhotoUploadButtonLabel: {
    id: 'ps.application:qualityPhotoUploadButtonLabel',
    defaultMessage: 'Velja mynd til að hlaða upp',
    description: `Upload button label`,
  },
  qualityPhotoNoPhotoDescription: {
    id: 'ps.application:qualityPhotoNoPhotoDescription',
    defaultMessage:
      'Til að hlaða inn mynd fyrir stæðiskort, þarf hún að fylla upp eftirfarandi skilyrði:',
    description: `Description text for no existing photo`,
  },
  qualityPhotoAltText: {
    id: 'ps.application:qualityPhotoAltText',
    defaultMessage: 'Þín mynd skv. ökuskírteinaskrá',
    description: `Alt text for the user's quality photo`,
  },
  qualityPhotoWarningTitle: {
    id: 'ps.application:qualityPhotoWarningTitle',
    defaultMessage: 'Ljósmynd í ökuskírteinaskrá ekki gæðamerkt',
    description: 'title for quality photo warning',
  },
  qualityPhotoWarningDescription: {
    id: 'ps.application:qualityPhotoWarningDescription',
    defaultMessage:
      'Núverandi ljósmynd þín í ökuskírteinaskrá stenst ekki gæðakröfur og þarf því að koma með nýja ljósmynd.',
    description: 'Description for quality photo warning',
  },
  qualityPhotoInstructions: {
    id: 'ps.application:qualityPhoto.instructions',
    defaultMessage: `
    Ljósmynd af umsækjanda þarf að vera tekin beint að framan, hún þarf að sýna höfuð (án höfuðfats)
    og herðar þar sem lýsing andlits er jöfn. Athuga þarf að ekki glampi á gleraugu og skyggi
    á augu. Bakgrunnur þarf að vera ljós og ekki virka truflandi á myndefni.
    Ljósmyndin þarf að vera prentuð á ljósmyndapappír og 35x45mm að stærð.
    `,
    description: 'Description of photo requirements',
  },
  qualityPhotoInstructionsBulletOne: {
    id: 'ps.application:qualityPhoto.instructionsbulletone',
    defaultMessage: `
    Ljósmynd af umsækjanda þarf að vera tekin beint að framan.
    `,
    description: 'Description of photo requirements',
  },
  qualityPhotoInstructionsBulletTwo: {
    id: 'ps.application:qualityPhoto.instructionsbullettwo',
    defaultMessage: `
    Sýna þarf höfuð (án höfuðfats) og herðar.
    `,
    description: 'Description of photo requirements',
  },
  qualityPhotoInstructionsBulletThree: {
    id: 'ps.application:qualityPhoto.instructionsbulletthree',
    defaultMessage: `
    Lýsing andlits þarf að vera jöfn.
    `,
    description: 'Description of photo requirements',
  },
  qualityPhotoInstructionsBulletFour: {
    id: 'ps.application:qualityPhoto.instructionsbulletfour',
    defaultMessage: `
    Athuga þarf að ekki glampi á gleraugu og skyggi á augu.
    `,
    description: 'Description of photo requirements',
  },
  qualityPhotoInstructionsBulletFive: {
    id: 'ps.application:qualityPhoto.instructionsbulletfive',
    defaultMessage: `
    Bakgrunnur þarf að vera ljós og ekki virka truflandi á myndefni.
    `,
    description: 'Description of photo requirements',
  },
  qualityPhotoNoPhotoAlertMessage: {
    id: 'ps.application:qualityPhoto.qualityPhotoNoPhotoAlertMessage',
    defaultMessage: 'Ath. Skylda er að hlaða inn mynd',
    description: 'Alert on no photo attachment',
  },

  /* Delivery method Section */
  deliveryMethodTitle: {
    id: 'ps.application:deliveryMethodTitle',
    defaultMessage: 'Afhending',
    description: 'Title for delivery method section',
  },
  deliveryMethodDescription: {
    id: 'ps.application:deliveryMethodDescription',
    defaultMessage:
      'Stæðiskort er sjálfkrafa sent með pósti á lögheimili eftir 3-5 virka daga frá umsóknardegi. Umsækjandi getur einnig valið að sækja stæðiskort á hvaða sýslumannsembætti sem er á landinu.',
    description: 'Description for delivery method section',
  },
  deliveryMethodHomeDelivery: {
    id: 'ps.application:deliveryMethodHomeDelivery',
    defaultMessage: 'Fá sent heim í pósti',
    description: 'Checkbox label for home delivery method',
  },
  deliveryMethodPickUp: {
    id: 'ps.application:deliveryMethodPickUp',
    defaultMessage: 'Sækja til Sýslumanns',
    description: 'Checkbox label for self-pickup',
  },
  deliveryMethodOfficeLabel: {
    id: 'ps.application:deliveryMethodOfficeLabel',
    defaultMessage: 'Embætti',
    description: 'Title for office',
  },
  deliveryMethodOfficeSelectPlaceholder: {
    id: 'ps.application:deliveryMethodOfficeSelectPlaceholder',
    defaultMessage: 'Veldu embætti',
    description: 'Placeholder for office selection',
  },

  /* Overview Section */
  overviewTitle: {
    id: 'ps.application:overviewTitle',
    defaultMessage: 'Yfirlit umsóknar',
    description: 'Title for overview section',
  },
  overviewSectionTitle: {
    id: 'ps.application:overviewTitle',
    defaultMessage: 'Yfirlit',
    description: 'Title for overview section',
  },
  overviewSectionDescription: {
    id: 'ps.application:overviewSectionDescription',
    defaultMessage:
      'Vinsamlegast staðfestu að neðangreindar upplýsingar séu réttar.,',
    description: 'Description for overview section',
  },
  overviewSelfPickupText: {
    id: 'ps.application:overviewSelfPickupText',
    defaultMessage: 'Þú hefur valið að sækja P-merkið sjálf/ur/t á: ',
    description: 'Text for delivery info',
  },
  overviewDeliveryText: {
    id: 'ps.application:overviewDeliveryText',
    defaultMessage: 'Þú hefur valið að fá P-merkið sent heim í pósti',
    description: 'Text for delivery info',
  },

  /* Congratulation Section */
  congratulationsTitleSuccess: {
    id: 'ps.application:congratulationsTitleSuccess',
    defaultMessage:
      'Umsókn þín um P-Merki hefur verið móttekin. Þú færð P-Merkið afhent á uppgefið heimilisfang/afhendingarstað eftir 3-5 virka daga.',
    description: 'Your application for P-sign was successful.',
  },
  congratulationsTitle: {
    id: 'ps.application:congratulationsTitle',
    defaultMessage: 'Til hamingju',
    description: 'Congratulations',
  },
  errorDataProvider: {
    id: 'ps.application:error.dataProvider',
    defaultMessage: 'Reyndu aftur síðar',
    description: 'Unhandled error in data provider',
  },
})
