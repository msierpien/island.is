import { defineMessages } from 'react-intl'

export const delimitation = {
  general: defineMessages({
    pageTitle: {
      id: 'dpac.application:section.delimitation.pageTitle',
      defaultMessage:
        'Til að Persónuvernd geti fjallað um kvörtunina þína þarf fyrst að kanna hvort hún fellur undir verksvið stofnunarinnar',
      description: 'Delimitation page title',
    },
  }),
  labels: defineMessages({
    inCourtProceedings: {
      id: 'dpac.application:section.delimitation.labels.inCourtProceedings',
      defaultMessage:
        'Er málið sem um ræðir til meðferðar hjá dómstólum eða öðrum stjórnvöldum?',
      description: 'Label for inCourtProceedings field',
    },
    concernsMediaCoverage: {
      id: 'dpac.application:section.delimitation.labels.concernsMediaCoverage',
      defaultMessage:
        'Ertu að kvarta yfir umfjöllun um þig eða aðra í fjölmiðlum?',
      description: 'Label for concernsMediaCoverage field',
    },
    concernsBanMarking: {
      id: 'dpac.application:section.delimitation.labels.concernsBanMarking',
      defaultMessage:
        'Ertu að kvarta yfir því að x-merking í símaskrá eða bannmerking í þjóðskrá hafi ekki verið virt?',
      description: 'Label for concernsBanMarking field',
    },
    concernsLibel: {
      id: 'dpac.application:section.delimitation.labels.concernsLibel',
      defaultMessage:
        'Ertu að kvarta yfir einhverju sem var sagt eða skrifað um þig á netinu eða á öðrum opinberum vettvangi?',
      description: 'Label for concernsLibel field',
    },
    concernsPersonalDataConflict: {
      id:
        'dpac.application:section.delimitation.labels.concernsPersonalDataConflict',
      defaultMessage:
        'Ertu að kvarta yfir því að hafa ekki fengið aðgang að persónuupplýsingum um þig, eða að þær hafi ekki verið leiðréttar eða þeim eytt?',
      description: 'Label for concernsPersonalDataConflict field',
    },
    concernsPersonalLettersOrSocialMedia: {
      id:
        'dpac.application:section.delimitation.labels.concernsPersonalLettersOrSocialMedia',
      defaultMessage:
        'Ertu að kvarta yfir opnun persónulegra bréfa eða þegar farið er inn á aðgang einstaklings á samfélagsmiðli eða einkatölvupóst í leyfisleysi?',
      description: 'Label for concernsPersonalLettersOrSocialMedia field',
    },
    agreementDescriptionBulletOne: {
      id:
        'dpac.application:section.delimitation.labels.agreementDescriptionBulletOne',
      defaultMessage:
        'Þegar kvörtun er tekin til meðferðar er gagnaðila (þ.e. þeim sem kvartað er yfir) tilkynnt um kvörtunina og sent afrit af henni og fylgiskjölum með henni. Honum er gefinn kostur á að koma andmælum sínum á framfæri.',
      description: 'Agreement description bullet one',
    },
    agreementDescriptionBulletTwo: {
      id:
        'dpac.application:section.delimitation.labels.agreementDescriptionBulletTwo',
      defaultMessage:
        'Ef Persónuvernd telur nauðsynlegt að upplýsa málið betur getur stofnunin óskað eftir frekari gögnum eða upplýsingum frá öllum aðilum, eftir því sem við á hverju sinni.',
      description: 'Agreement description bullet Two',
    },
    agreementDescriptionBulletThree: {
      id:
        'dpac.application:section.delimitation.labels.agreementDescriptionBulletThree',
      defaultMessage:
        'Málsgögn eru almennt aðgengileg öllum málsaðilum á grundvelli ákvæða stjórnsýslulaga, nr. 37/1993, að teknu tilliti til undantekninga samkvæmt þeim lögum. Þá geta þau eftir atvikum verið aðgengileg öðrum á grundvelli annarra laga, svo sem upplýsingalaga nr. 140/2012 eða laga um persónuvernd og vinnslu persónuupplýsinga nr. 90/2018.',
      description: 'Agreement description bullet Three',
    },
    agreementDescriptionBulletFour: {
      id:
        'dpac.application:section.delimitation.labels.agreementDescriptionBulletFour',
      defaultMessage:
        'Öll mál sem berast Persónuvernd eru sett í viðeigandi farveg eins fljótt og unnt er og málsaðilum tilkynnt um það, þó svo að á því geti orðið tafir í ljósi mikilla anna hjá Persónuvernd.',
      description: 'Agreement description bullet Four',
    },
    agreementDescriptionBulletFive: {
      id:
        'dpac.application:section.delimitation.labels.agreementDescriptionBulletFive',
      defaultMessage:
        'Almennt er áætlað að afgreiðsla kvartana geti tekið um 9-15 mánuði. Afgreiðslutími getur þó orðið lengri ef mál eru flókin eða mikil að umfangi, eða ef álag hjá Persónuvernd eykst.',
      description: 'Agreement description bullet Five',
    },
    agreementDescriptionBulletSix: {
      id:
        'dpac.application:section.delimitation.labels.agreementDescriptionBulletSix',
      defaultMessage:
        'Úrskurðir Persónuverndar í kvörtunarmálum eru almennt birtir á vefsíðu stofnunarinnar. Nöfn einstaklinga eru þó afmáð áður, sem og aðrar upplýsingar sem gera kleift að persónugreina kvartendur.',
      description: 'Agreement description bullet Six',
    },
    agreementDescriptionBulletSeven: {
      id:
        'dpac.application:section.delimitation.labels.agreementDescriptionBulletSeven',
      defaultMessage:
        'Ítarlegri upplýsingar um málsmeðferð hjá Persónuvernd má nálgast í málsmeðferðarreglum stofnunarinnar.',
      description: 'Agreement description bullet Seven',
    },
    agreementDescriptionBulletEight: {
      id:
        'dpac.application:section.delimitation.labels.agreementDescriptionBulletEight',
      defaultMessage:
        'Ítarlegri upplýsingar um vinnslu persónuupplýsinga hjá Persónuvernd má nálgast í persónuverndarstefnu stofnunarinnar.',
      description: 'Agreement description bullet Eight',
    },
  }),
  links: defineMessages({
    inCourtProceedingsTitle: {
      id: 'dpac.application:section.delimitation.links.inCourtProceedingsTitle',
      defaultMessage: 'Frekari upplýsingar',
      description: 'In court proceedings url title',
    },
    inCourtProceedingsUrl: {
      id: 'dpac.application:section.delimitation.links.inCourtProceedingsUrl',
      defaultMessage:
        'https://www.personuvernd.is/einstaklingar/spurt-og-svarad/allar-spurningar-og-svor/hvad-getur-personuvernd-ekki-gert',
      description: 'In court proceedings url',
    },
    concernsMediaCoverageFirstTitle: {
      id:
        'dpac.application:section.delimitation.links.concernsMediaCoverageFirstTitle',
      defaultMessage: 'Fjölmiðlanefnd',
      description: 'Concerns media coverage first url title',
    },
    concernsMediaCoverageFirstUrl: {
      id:
        'dpac.application:section.delimitation.links.concernsMediaCoverageFirstUrl',
      defaultMessage: 'https://fjolmidlanefnd.is/',
      description: 'Concerns media coverage first url',
    },
    concernsMediaCoverageSecondTitle: {
      id:
        'dpac.application:section.delimitation.links.concernsMediaCoverageSecondTitle',
      defaultMessage: 'Siðanefnd Blaðamannafélags Íslands',
      description: 'Concerns media coverage second url title',
    },
    concernsMediaCoverageSecondUrl: {
      id:
        'dpac.application:section.delimitation.links.concernsMediaCoverageSecondUrl',
      defaultMessage: 'https://www.press.is/is/faglegt/sidavefur/sidanefnd',
      description: 'Concerns media coverage second url',
    },
    concernsBanMarkingFirstTitle: {
      id:
        'dpac.application:section.delimitation.links.concernsBanMarkingFirstTitle',
      defaultMessage: 'Fjarskiptastofa',
      description: 'Concerns ban marking first url title',
    },
    concernsBanMarkingFirstUrl: {
      id:
        'dpac.application:section.delimitation.links.concernsBanMarkingFirstUrl',
      defaultMessage: 'https://fjarskiptastofa.is/',
      description: 'Concerns ban marking first url',
    },
    concernsBanMarkingSecondTitle: {
      id:
        'dpac.application:section.delimitation.links.concernsBanMarkingSecondTitle',
      defaultMessage: 'Þjóðskrá Íslands',
      description: 'Concerns ban marking second url title',
    },
    concernsBanMarkingSecondUrl: {
      id:
        'dpac.application:section.delimitation.links.concernsBanMarkingSecondUrl',
      defaultMessage: 'https://island.is/kvortun-vegna-skraningar-i-bannskra',
      description: 'Concerns ban marking second url',
    },
    concernsLibelTitle: {
      id: 'dpac.application:section.delimitation.links.concernsLibelTitle',
      defaultMessage: 'Nánari uppýsingar',
      description: 'Concerns libel url title',
    },
    concernsLibelUrl: {
      id: 'dpac.application:section.delimitation.links.iconcernsLibelUrl',
      defaultMessage:
        'https://www.personuvernd.is/einstaklingar/spurt-og-svarad/allar-spurningar-og-svor/hvad-getur-personuvernd-ekki-gert',
      description: 'Concerns libel url',
    },
  }),
}
