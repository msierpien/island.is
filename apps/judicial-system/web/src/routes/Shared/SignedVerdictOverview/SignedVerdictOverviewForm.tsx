import React, { useContext } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { ValueType } from 'react-select/src/types'

import {
  Accordion,
  Box,
  Button,
  Select,
  Tag,
  Text,
  Tooltip,
  Stack,
  Divider,
} from '@island.is/island-ui/core'
import {
  BlueBox,
  CourtRecordAccordionItem,
  FormContentContainer,
  InfoCard,
  PdfRow,
  PoliceRequestAccordionItem,
  RulingAccordionItem,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseAppealDecision,
  CaseCustodyRestrictions,
  CaseDecision,
  CaseState,
  CaseType,
  InstitutionType,
  isRestrictionCase,
  isInvestigationCase,
  UserRole,
  isAcceptingCaseDecision,
  Case,
} from '@island.is/judicial-system/types'
import { getRestrictionTagVariant } from '@island.is/judicial-system-web/src/utils/stepHelper'
import {
  capitalize,
  caseTypes,
  formatDate,
  getShortRestrictionByValue,
  TIME_FORMAT,
} from '@island.is/judicial-system/formatters'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import { core } from '@island.is/judicial-system-web/messages'
import { useInstitution } from '@island.is/judicial-system-web/src/utils/hooks'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import CaseFilesAccordionItem from '@island.is/judicial-system-web/src/components/AccordionItems/CaseFilesAccordionItem/CaseFilesAccordionItem'
import { signedVerdictOverview as m } from '@island.is/judicial-system-web/messages/Core/signedVerdictOverview'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'

import AppealSection from './Components/AppealSection/AppealSection'
import { SignedDocument } from './Components/SignedDocument'
import CaseDates from './Components/CaseDates/CaseDates'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  setAccusedAppealDate: () => void
  setProsecutorAppealDate: () => void
  withdrawAccusedAppealDate: () => void
  withdrawProsecutorAppealDate: () => void
  shareCaseWithAnotherInstitution: (
    selectedInstitution?: ValueType<ReactSelectOption>,
  ) => void
  selectedSharingInstitutionId: ValueType<ReactSelectOption>
  setSelectedSharingInstitutionId: React.Dispatch<
    React.SetStateAction<ValueType<ReactSelectOption>>
  >
  isRequestingCourtRecordSignature: boolean
  handleRequestCourtRecordSignature: () => void
  handleOpenDateAlteringModal: () => void
}

const SignedVerdictOverviewForm: React.FC<Props> = (props) => {
  const {
    workingCase,
    setWorkingCase,
    setAccusedAppealDate,
    setProsecutorAppealDate,
    withdrawAccusedAppealDate,
    withdrawProsecutorAppealDate,
    shareCaseWithAnotherInstitution,
    selectedSharingInstitutionId,
    setSelectedSharingInstitutionId,
    isRequestingCourtRecordSignature,
    handleRequestCourtRecordSignature,
    handleOpenDateAlteringModal,
  } = props
  const router = useRouter()
  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()
  const { prosecutorsOffices } = useInstitution()

  /**
   * If the case is not rejected it must be accepted because
   * this screen is only rendered if the case is either accepted
   * or rejected. Here we are first handling the case where a case
   * is rejected, then the case where a case is accepted and the
   * custody end date is in the past and then we assume that
   * the case is accepted and the custody end date has not come yet.
   * For accepted cases, we first handle the case where the judge
   * decided only accept an alternative travel ban and finally we
   * assume that the actual custody was accepted.
   */
  const titleForCase = (theCase: Case) => {
    const isTravelBan =
      theCase.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN ||
      theCase.type === CaseType.TRAVEL_BAN

    if (theCase.state === CaseState.REJECTED) {
      if (isInvestigationCase(theCase.type)) {
        return 'Kröfu um rannsóknarheimild hafnað'
      } else {
        return 'Kröfu hafnað'
      }
    }

    if (theCase.state === CaseState.DISMISSED) {
      return formatMessage(m.dismissedTitle)
    }

    if (theCase.isValidToDateInThePast) {
      return isTravelBan ? 'Farbanni lokið' : 'Gæsluvarðhaldi lokið'
    }

    return isTravelBan
      ? 'Farbann virkt'
      : isInvestigationCase(theCase.type)
      ? 'Krafa um rannsóknarheimild samþykkt'
      : 'Gæsluvarðhald virkt'
  }

  return (
    <FormContentContainer>
      <Box marginBottom={5}>
        <Box marginBottom={3}>
          <Button
            variant="text"
            preTextIcon="arrowBack"
            onClick={() => router.push(Constants.REQUEST_LIST_ROUTE)}
          >
            Til baka
          </Button>
        </Box>
        <Box display="flex" justifyContent="spaceBetween">
          <Box>
            <Box marginBottom={1}>
              <Text as="h1" variant="h1">
                {titleForCase(workingCase)}
              </Text>
            </Box>
          </Box>
          <Box display="flex" flexDirection="column">
            {workingCase.isCustodyIsolation && (
              <Box marginBottom={1}>
                <Tag
                  variant={getRestrictionTagVariant(
                    CaseCustodyRestrictions.ISOLATION,
                  )}
                  outlined
                  disabled
                >
                  {getShortRestrictionByValue(
                    CaseCustodyRestrictions.ISOLATION,
                  )}
                </Tag>
              </Box>
            )}
            {
              // Custody restrictions
              isAcceptingCaseDecision(workingCase.decision) &&
                workingCase.type === CaseType.CUSTODY &&
                workingCase.requestedCustodyRestrictions
                  ?.filter((restriction) =>
                    [
                      CaseCustodyRestrictions.VISITAION,
                      CaseCustodyRestrictions.COMMUNICATION,
                      CaseCustodyRestrictions.MEDIA,
                      CaseCustodyRestrictions.WORKBAN,
                      CaseCustodyRestrictions.NECESSITIES,
                    ].includes(restriction),
                  )
                  ?.map((custodyRestriction, index) => (
                    <Box marginTop={index > 0 ? 1 : 0} key={index}>
                      <Tag
                        variant={getRestrictionTagVariant(custodyRestriction)}
                        outlined
                        disabled
                      >
                        {getShortRestrictionByValue(custodyRestriction)}
                      </Tag>
                    </Box>
                  ))
            }
            {
              // Travel ban restrictions
              workingCase.type === CaseType.TRAVEL_BAN &&
                (workingCase.decision === CaseDecision.ACCEPTING ||
                  workingCase.decision === CaseDecision.ACCEPTING_PARTIALLY) &&
                workingCase.requestedCustodyRestrictions
                  ?.filter((restriction) =>
                    [
                      CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION,
                      CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_CONFISCATE_PASSPORT,
                    ].includes(restriction),
                  )
                  ?.map((custodyRestriction, index) => (
                    <Box marginTop={index > 0 ? 1 : 0} key={index}>
                      <Tag
                        variant={getRestrictionTagVariant(custodyRestriction)}
                        outlined
                        disabled
                      >
                        {getShortRestrictionByValue(custodyRestriction)}
                      </Tag>
                    </Box>
                  ))
            }
          </Box>
        </Box>
        <CaseDates
          workingCase={workingCase}
          button={{
            label: formatMessage(core.update),
            onClick: handleOpenDateAlteringModal,
            icon: 'pencil',
          }}
        />
      </Box>
      <Box marginBottom={workingCase.isMasked ? 15 : 6}>
        <InfoCard
          data={[
            {
              title: 'LÖKE málsnúmer',
              value: workingCase.policeCaseNumber,
            },
            {
              title: 'Málsnúmer héraðsdóms',
              value: workingCase.courtCaseNumber,
            },
            {
              title: 'Embætti',
              value: `${
                workingCase.creatingProsecutor?.institution?.name ??
                'Ekki skráð'
              }`,
            },
            { title: 'Dómstóll', value: workingCase.court?.name },
            { title: 'Ákærandi', value: workingCase.prosecutor?.name },
            { title: 'Dómari', value: workingCase.judge?.name },
            ...(workingCase.registrar
              ? [{ title: 'Dómritari', value: workingCase.registrar?.name }]
              : []),
            // Conditionally add this field based on case type
            ...(isInvestigationCase(workingCase.type)
              ? [
                  {
                    title: 'Tegund kröfu',
                    value: capitalize(caseTypes[workingCase.type]),
                  },
                ]
              : []),
          ]}
          defendants={workingCase.defendants ?? []}
          defender={{
            name: workingCase.defenderName ?? '',
            email: workingCase.defenderEmail,
            phoneNumber: workingCase.defenderPhoneNumber,
            defenderIsSpokesperson: workingCase.defenderIsSpokesperson,
          }}
        />
      </Box>
      {(workingCase.accusedAppealDecision === CaseAppealDecision.POSTPONE ||
        workingCase.accusedAppealDecision === CaseAppealDecision.APPEAL ||
        workingCase.prosecutorAppealDecision === CaseAppealDecision.POSTPONE ||
        workingCase.prosecutorAppealDecision === CaseAppealDecision.APPEAL) &&
        (user?.role === UserRole.JUDGE || user?.role === UserRole.REGISTRAR) &&
        user?.institution?.type !== InstitutionType.HIGH_COURT &&
        !workingCase.isMasked && (
          <Box marginBottom={7}>
            <AppealSection
              workingCase={workingCase}
              setAccusedAppealDate={setAccusedAppealDate}
              setProsecutorAppealDate={setProsecutorAppealDate}
              withdrawAccusedAppealDate={withdrawAccusedAppealDate}
              withdrawProsecutorAppealDate={withdrawProsecutorAppealDate}
            />
          </Box>
        )}
      {user?.role !== UserRole.STAFF && !workingCase.isMasked && (
        <>
          <Box marginBottom={5} data-testid="accordionItems">
            <Accordion>
              <PoliceRequestAccordionItem workingCase={workingCase} />
              <CourtRecordAccordionItem workingCase={workingCase} />
              <RulingAccordionItem workingCase={workingCase} />
              {user && (
                <CaseFilesAccordionItem
                  workingCase={workingCase}
                  setWorkingCase={setWorkingCase}
                  user={user}
                />
              )}
            </Accordion>
          </Box>
          <Box marginBottom={7}>
            <BlueBox>
              <Box marginBottom={2} textAlign="center">
                <Text as="h2" variant="h3">
                  {formatMessage(m.conclusionTitle)}
                </Text>
              </Box>
              <Box marginBottom={3}>
                <Box marginTop={1}>
                  <Text variant="intro">{workingCase.conclusion}</Text>
                </Box>
              </Box>
              <Box marginBottom={1} textAlign="center">
                <Text variant="h4">
                  {workingCase?.judge ? workingCase.judge.name : user?.name}
                </Text>
              </Box>
            </BlueBox>
          </Box>
        </>
      )}
      {!workingCase.isMasked && (
        <Box marginBottom={10}>
          <Text as="h2" variant="h3" marginBottom={5}>
            {formatMessage(m.caseDocuments)}
          </Text>
          <Box marginBottom={2}>
            <Stack space={2} dividers>
              {user?.role !== UserRole.STAFF && (
                <PdfRow
                  caseId={workingCase.id}
                  title={formatMessage(core.pdfButtonRequest)}
                  pdfType="request"
                />
              )}
              {workingCase.type === CaseType.CUSTODY &&
                workingCase.state === CaseState.ACCEPTED &&
                isAcceptingCaseDecision(workingCase.decision) && (
                  <PdfRow
                    caseId={workingCase.id}
                    title={formatMessage(core.pdfButtonCustodyNotice)}
                    pdfType="custodyNotice"
                  />
                )}
              <PdfRow
                caseId={workingCase.id}
                title={formatMessage(core.pdfButtonRulingShortVersion)}
                pdfType="courtRecord"
              >
                {workingCase.courtRecordSignatory ? (
                  <SignedDocument
                    signatory={workingCase.courtRecordSignatory.name}
                    signingDate={workingCase.courtRecordSignatureDate}
                  />
                ) : user?.role === UserRole.JUDGE ||
                  user?.role === UserRole.REGISTRAR ? (
                  <Button
                    loading={isRequestingCourtRecordSignature}
                    onClick={(event) => {
                      event.stopPropagation()
                      handleRequestCourtRecordSignature()
                    }}
                  >
                    {formatMessage(m.signButton)}
                  </Button>
                ) : (
                  <Text>{formatMessage(m.unsignedDocument)}</Text>
                )}
              </PdfRow>
              {user?.role !== UserRole.STAFF && (
                <PdfRow
                  caseId={workingCase.id}
                  title={formatMessage(core.pdfButtonRuling)}
                  pdfType="ruling"
                >
                  <SignedDocument
                    signatory={workingCase.judge?.name}
                    signingDate={workingCase.rulingDate}
                  />
                </PdfRow>
              )}
            </Stack>
          </Box>
          <Divider />
        </Box>
      )}
      {user?.role === UserRole.PROSECUTOR &&
        user.institution?.id === workingCase.prosecutor?.institution?.id &&
        isRestrictionCase(workingCase.type) && (
          <Box marginBottom={9}>
            <Box marginBottom={3}>
              <Text variant="h3">
                Opna mál fyrir öðru embætti{' '}
                <Tooltip text="Hægt er að gefa öðru embætti aðgang að málinu. Viðkomandi embætti getur skoðað málið og farið fram á framlengingu." />
              </Text>
            </Box>
            <BlueBox>
              <Box display="flex">
                <Box flexGrow={1} marginRight={2}>
                  <Select
                    name="sharedWithProsecutorsOfficeId"
                    label="Veldu embætti"
                    placeholder="Velja embætti sem tekur við málinu"
                    size="sm"
                    icon={
                      workingCase.sharedWithProsecutorsOffice
                        ? 'checkmark'
                        : undefined
                    }
                    options={prosecutorsOffices
                      .map((prosecutorsOffice) => ({
                        label: prosecutorsOffice.name,
                        value: prosecutorsOffice.id,
                      }))
                      .filter((t) => t.value !== user?.institution?.id)}
                    value={
                      workingCase.sharedWithProsecutorsOffice
                        ? {
                            label: workingCase.sharedWithProsecutorsOffice.name,
                            value: workingCase.sharedWithProsecutorsOffice.id,
                          }
                        : selectedSharingInstitutionId
                        ? {
                            label: (selectedSharingInstitutionId as ReactSelectOption)
                              .label,
                            value: (selectedSharingInstitutionId as ReactSelectOption)
                              .value as string,
                          }
                        : null
                    }
                    onChange={(so: ValueType<ReactSelectOption>) =>
                      setSelectedSharingInstitutionId(so)
                    }
                    disabled={Boolean(workingCase.sharedWithProsecutorsOffice)}
                  />
                </Box>
                <Button
                  size="small"
                  disabled={
                    !selectedSharingInstitutionId &&
                    !workingCase.sharedWithProsecutorsOffice
                  }
                  onClick={() =>
                    shareCaseWithAnotherInstitution(
                      selectedSharingInstitutionId,
                    )
                  }
                >
                  {workingCase.sharedWithProsecutorsOffice
                    ? 'Loka aðgangi'
                    : 'Opna mál'}
                </Button>
              </Box>
            </BlueBox>
          </Box>
        )}
    </FormContentContainer>
  )
}

export default SignedVerdictOverviewForm
