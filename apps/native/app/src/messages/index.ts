type TranslatedMessages = typeof is;
export type TranslatedMessage = keyof TranslatedMessages;

// Source of truth for other languages
export const is = {
  "login.welcomeMessage": "Skráðu þig inn í appið með rafrænum skilríkjum",
  "login.loginButtonText": "Skrá inn",
  "login.languageButtonText": "English",
  "login.needHelpButtonText": "Þarftu hjálp",
  "onboarding.notifications.title": "Fáðu tilkynningar um ný rafræn skjöl um leið og þau berast.",
  "onboarding.notifications.allowNotificationsButtonText": "Leyfa tilkynningar",
  "onboarding.notifications.decideLaterButtonText": "Ákveða seinna",
  "onboarding.appLock.title": "Skjálæsing tryggir að enginn geti opnað appið nema þú.",
  "onboarding.appLock.choosePinButtonText": "Velja PIN",
  "onboarding.pinCode.enterPin": "Veldu 4-tölustafa PIN",
  "onboarding.pinCode.confirmPin": "Staðfestu PIN númerið",
  "onboarding.pinCode.cancelButtonText": "Hætta við",
  "onboarding.pinCode.nonMatchingPinCodes": "Númerin pössuðu ekki saman",
  "onboarding.biometrics.title": "Þú getur einnig notað {biometricType} til að opna appið án þess að slá inn PIN.",
  "onboarding.biometrics.notEnrolled": "Þitt tæki styður {biometricType} en þú hefur ekki virkt það.",
  "onboarding.biometrics.useBiometricsButtonText": "Nota {biometricType}",
  "onboarding.biometrics.skipButtonText": "Sleppa því í bili",
  "onboarding.biometrics.type.faceId": "Face ID",
  "onboarding.biometrics.type.facialRecognition": 'andlitsgreiningu',
  "onboarding.biometrics.type.fingerprint": "fingrafar",
  "onboarding.biometrics.type.iris": "augnskanna",
  // settings
  "settings.screenTitle": "Notandi",
  "settings.tabs.preferences": "Stillingar",
  "settings.tabs.personalInfo": "Persónuupplýsingar",
  "settings.accessibilityLayout.groupTitle": "Útlit og aðgengi",
  "settings.accessibilityLayout.language": "Tungumál",
  "settings.accessibilityLayout.darkMode": "Dökkur hamur",
  "settings.communication.groupTitle": "Tilkynningar og samskipti",
  "settings.communication.newDocumentsNotifications": "Fá tilkynningar um ný skjöl",
  "settings.communication.appUpdatesNotifications": "Fá tilkynningar um nýjungar í appinu",
  "settings.communication.applicationsNotifications": "Fá tilkynningar um stöðu umsókna",
  "settings.natreg.displayName": "Birtingarnafn",
  "settings.natreg.nationalId": "Kennitala",
  "settings.natreg.birthPlace": "Fæðingastaður",
  "settings.natreg.legalResidence": "Lögheimili",
  "settings.natreg.gender": "Kyn",
  "settings.natreg.genderValue": `{
    gender,
    select,
    FEMALE {Kona}
    MALE {Karl}
    TRANSGENDER {Kynsegin}
    MALE_MINOR {Drengur}
    FEMALE_MINOR {Stúlka}
    TRANSGENDER_MINOR {Kynsegin}
    UNKNOWN {Óupplýst}
  }`,
  "settings.natreg.maritalStatus": "Hjúskaparstaða",
  "settings.natreg.maritalStatusValue": `{
    maritalStatus,
    select,
    MARRIED {{gender, select, FEMALE {Gift} MALE {Giftur}}}
    UNMARRIED {{gender, select, FEMALE {Ógift} MALE {Ógiftur}}}
    WIDOWED {{gender, select, FEMALE {Ekkja} MALE {Ekkill}}}
    SEPARATED {{gender, select, FEMALE {Aðskilin} MALE {Aðskilinn}}}
    DIVORCED {{gender, select, FEMALE {Fráskilin} MALE {Fráskilinn}}}
    MARRIED_LIVING_SEPARATELY {{gender, select, FEMALE {Gift} MALE {Giftur}}}
    MARRIED_TO_FOREIGN_LAW_PERSON {{gender, select, FEMALE {Gift} MALE {Giftur}}}
    UNKNOWN {Óupplýst}
    FOREIGN_RESIDENCE_MARRIED_TO_UNREGISTERED_PERSON {{gender, select, FEMALE {Gift} MALE {Giftur}}}
    ICELANDIC_RESIDENCE_MARRIED_TO_UNREGISTERED_PERSON {{gender, select, FEMALE {Gift} MALE {Giftur}}}
  }`,
  "settings.natreg.citizenship": "Ríkisfang",
  "settings.natreg.religion": "Trú- eða lífskoðunarfélag",
  // home
  "home.screenTitle": "Yfirlit",
  "home.applicationsStatus": "Staða umsókna",
  "home.notifications": "Tilkynningar",
  // inbox
  "inbox.bottomTabText": "Skjöl",
  // wallet
  "wallet.bottomTabText": "Skírteini",
  // other
  "inbox.screenTitle": "Skjöl",
  "wallet.screenTitle": "Skírteini",
  "notifications.screenTitle": "Tilkynningar",
  "documentDetail.screenTitle": "Skjal",
  "notificationDetail.screenTitle": "Tilkynning"
}

export const en: TranslatedMessages = {
  "login.welcomeMessage": "Log in to the app with electronic ID",
  "login.loginButtonText": "Login",
  "login.languageButtonText": "Íslenska",
  "login.needHelpButtonText": "Need help",
  "onboarding.notifications.title": "Receive notifications of new documents as soon as they are received.",
  "onboarding.notifications.allowNotificationsButtonText": "Allow notifications",
  "onboarding.notifications.decideLaterButtonText": "Decide later",
  "onboarding.appLock.title": "Screen lock ensures that no one can open the app except you.",
  "onboarding.appLock.choosePinButtonText": "Choose PIN",
  "onboarding.pinCode.enterPin": "Choose 4-digit PIN",
  "onboarding.pinCode.confirmPin": "Confirm the 4-digit PIN",
  "onboarding.pinCode.cancelButtonText": "Cancel",
  "onboarding.pinCode.nonMatchingPinCodes": "The numbers did not match",
  "onboarding.biometrics.title": "You can also use {biometricType} to access the app without entering a PIN.",
  "onboarding.biometrics.notEnrolled": "Your device supports {biometricType} but you haven't enrolled into it yet.",
  "onboarding.biometrics.useBiometricsButtonText": "Use {biometricType}",
  "onboarding.biometrics.skipButtonText": "Skip for now",
  "onboarding.biometrics.type.faceId": "Face ID",
  "onboarding.biometrics.type.facialRecognition": 'facial recognition',
  "onboarding.biometrics.type.fingerprint": "fingerprint",
  "onboarding.biometrics.type.iris": "iris scanner",
  // settings
  "settings.screenTitle": "User",
  "settings.tabs.preferences": "Settings",
  "settings.tabs.personalInfo": "Personal info",
  "settings.accessibilityLayout.groupTitle": "Layout and accessibility",
  "settings.accessibilityLayout.language": "Language",
  "settings.accessibilityLayout.darkMode": "Dark mode",
  "settings.communication.groupTitle": "Notifications and communication",
  "settings.communication.newDocumentsNotifications": "Get notifications of new documents",
  "settings.communication.appUpdatesNotifications": "Get notifications about app updates",
  "settings.communication.applicationsNotifications": "Get notifications about application status updates",
  "settings.natreg.displayName": "Display name",
  "settings.natreg.nationalId": "Social ID",
  "settings.natreg.birthPlace": "Birthplace",
  "settings.natreg.legalResidence": "Legal domicile",
  "settings.natreg.gender": "Gender",
  "settings.natreg.genderValue": `{
    gender,
    select,
    FEMALE {Female}
    MALE {Male}
    TRANSGENDER {Transgender}
    MALE_MINOR {Boy}
    FEMALE_MINOR {Girl}
    TRANSGENDER_MINOR {Transgender}
    UNKNOWN {Unknown}
  }`,
  "settings.natreg.maritalStatus": "Marital status",
  "settings.natreg.maritalStatusValue": `{
    maritalStatus,
    select,
    MARRIED {Married}
    UNMARRIED {Unmarried}
    WIDOWED {Widowed}
    SEPARATED {Separated}
    DIVORCED {Divorced}
    MARRIED_LIVING_SEPARATELY {Married}
    MARRIED_TO_FOREIGN_LAW_PERSON {Married}
    UNKNOWN {Unknown}
    FOREIGN_RESIDENCE_MARRIED_TO_UNREGISTERED_PERSON {Married}
    ICELANDIC_RESIDENCE_MARRIED_TO_UNREGISTERED_PERSON {Married}
  }`,
  "settings.natreg.citizenship": "Citizenship",
  "settings.natreg.religion": "Religion",
  // Home
  "home.screenTitle": "Overview",
  "home.applicationsStatus": "Applications status",
  "home.notifications": "Notifications",
  // inbox
  "inbox.bottomTabText": "Inbox",
  // wallet
  "wallet.bottomTabText": "Wallet",
  /// other
  "inbox.screenTitle": "Inbox",
  "wallet.screenTitle": "Wallet",
  "notifications.screenTitle": "Notifications",
  "documentDetail.screenTitle": "Document",
  "notificationDetail.screenTitle": "Notification"
}
