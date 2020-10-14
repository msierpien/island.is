import {
  Accordion,
  AccordionItem,
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import React, { useContext, useEffect, useState } from 'react'
import { FormFooter } from '../../../shared-components/FormFooter'
import { JudgeLogo } from '../../../shared-components/Logos'
import Modal from '../../../shared-components/Modal/Modal'
import {
  AppealDecitionRole,
  Case,
  ConfirmSignatureResponse,
  RequestSignatureResponse,
} from '../../../types'
import useWorkingCase from '../../../utils/hooks/useWorkingCase'
import {
  constructConclusion,
  getAppealDecitionText,
  renderFormStepper,
} from '../../../utils/stepHelper'
import * as Constants from '../../../utils/constants'
import {
  TIME_FORMAT,
  formatDate,
  formatCustodyRestrictions,
} from '@island.is/judicial-system/formatters'
import { parseTransition } from '../../../utils/formatters'
import { capitalize } from 'lodash'
import AccordionListItem from '@island.is/judicial-system-web/src/shared-components/AccordionListItem/AccordionListItem'
import { CaseState, CaseTransition } from '@island.is/judicial-system/types'
import * as api from '../../../api'
import { userContext } from '@island.is/judicial-system-web/src/utils/userContext'
import { useHistory } from 'react-router-dom'

export const Confirmation: React.FC = () => {
  const [workingCase, setWorkingCase] = useWorkingCase()
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [signatureResponse, setSignatureResponse] = useState<
    RequestSignatureResponse
  >()
  const [confirmSignatureResponse, setConfirmSignatureResponse] = useState<
    ConfirmSignatureResponse
  >()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const uContext = useContext(userContext)
  const history = useHistory()

  useEffect(() => {
    document.title = 'Yfirlit úrskurðar - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    const wc: Case = JSON.parse(window.localStorage.getItem('workingCase'))
    if (wc && !workingCase) {
      setWorkingCase(wc)
    }
  }, [workingCase, setWorkingCase])

  useEffect(() => {
    if (!modalVisible) {
      setSignatureResponse(null)
      setConfirmSignatureResponse(null)
    }
  }, [modalVisible, setSignatureResponse, setConfirmSignatureResponse])

  const handleNextButtonClick = async () => {
    try {
      if (workingCase.state === CaseState.SUBMITTED) {
        // Parse the transition request
        const transitionRequest = parseTransition(
          workingCase.modified,
          workingCase.rejecting ? CaseTransition.REJECT : CaseTransition.ACCEPT,
        )

        // Transition the case
        const response = await api.transitionCase(
          workingCase.id,
          transitionRequest,
        )

        if (response !== 200) {
          // Improve error handling at some point
          return false
        }

        return true
      }
    } catch (e) {
      return false
    }
  }

  const renderContolCode = () => {
    return (
      <>
        <Box marginBottom={2}>
          <Text variant="h2" color="blue400">
            {`Öryggistala: ${signatureResponse.response.controlCode}`}
          </Text>
        </Box>
        <Text>
          Þetta er ekki pin-númerið. Staðfestu aðeins innskráningu ef sama
          öryggistala birtist í símanum þínum.
        </Text>
      </>
    )
  }

  return workingCase ? (
    <>
      <Box marginTop={7} marginBottom={30}>
        <GridContainer>
          <GridRow>
            <GridColumn span={'3/12'}>
              <JudgeLogo />
            </GridColumn>
            <GridColumn span={'8/12'} offset={'1/12'}>
              <Box marginBottom={10}>
                <Text as="h1" variant="h1">
                  Krafa um gæsluvarðhald
                </Text>
                <Box display="flex" marginTop={1}>
                  <Box marginRight={2}>
                    <Text variant="small">{`Krafa stofnuð: ${formatDate(
                      workingCase.created,
                      'P',
                    )}`}</Text>
                  </Box>
                  <Text variant="small">{`Þinghald: ${formatDate(
                    workingCase.courtStartTime,
                    'P',
                  )}`}</Text>
                </Box>
              </Box>
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn span={['12/12', '3/12']}>
              {renderFormStepper(1, 3)}
            </GridColumn>
            <GridColumn span={['12/12', '7/12']} offset={['0', '1/12']}>
              <Box component="section" marginBottom={7}>
                <Text
                  variant="h2"
                  as="h2"
                >{`Mál nr. ${workingCase.courtCaseNumber}`}</Text>
                <Text fontWeight="semiBold">{`LÖKE málsnr. ${workingCase.policeCaseNumber}`}</Text>
              </Box>
              <Box marginBottom={9}>
                <Accordion>
                  <AccordionItem
                    id="id_1"
                    label="Krafan um gæsluvarðhald frá Lögreglu"
                  >
                    <Box marginBottom={2}>
                      <Text variant="h4" as="h4">
                        Grunnupplýsingar
                      </Text>
                    </Box>
                    <Box marginBottom={1}>
                      <Text>Kennitala: {workingCase.accusedNationalId}</Text>
                    </Box>
                    <Box marginBottom={1}>
                      <Text>Fullt nafn: {workingCase.accusedName}</Text>
                    </Box>
                    <Box marginBottom={3}>
                      <Text>Lögheimili: {workingCase.accusedAddress}</Text>
                    </Box>
                    <AccordionListItem title="Tími handtöku">
                      {`${capitalize(
                        formatDate(workingCase.arrestDate, 'PPPP'),
                      )} kl. ${formatDate(
                        workingCase.arrestDate,
                        TIME_FORMAT,
                      )}`}
                    </AccordionListItem>
                    <AccordionListItem title="Ósk um fyrirtökudag og tíma">
                      {`${capitalize(
                        formatDate(workingCase.requestedCourtDate, 'PPPP'),
                      )} kl. ${formatDate(
                        workingCase.requestedCourtDate,
                        TIME_FORMAT,
                      )}`}
                    </AccordionListItem>
                    <AccordionListItem title="Dómkröfur">
                      {`Gæsluvarðhald til ${capitalize(
                        formatDate(workingCase.custodyEndDate, 'PPP'),
                      )} kl. ${formatDate(
                        workingCase.custodyEndDate,
                        TIME_FORMAT,
                      )}`}
                    </AccordionListItem>
                    <AccordionListItem title="Lagaákvæði">
                      {workingCase.lawsBroken}
                    </AccordionListItem>
                    <Box marginBottom={1}>
                      <Text variant="h5">Takmarkanir á gæslu</Text>
                    </Box>
                    <Box marginBottom={4}>
                      <Text>
                        {formatCustodyRestrictions(
                          workingCase.custodyRestrictions,
                        )}
                      </Text>
                    </Box>
                    <Box marginBottom={2}>
                      <Text variant="h4" as="h4">
                        Greinargerð um málsatvik og lagarök
                      </Text>
                    </Box>
                    <AccordionListItem title="Málsatvik rakin">
                      {workingCase.caseFacts}
                    </AccordionListItem>
                    <AccordionListItem title="Framburðir">
                      {workingCase.witnessAccounts}
                    </AccordionListItem>
                    <AccordionListItem title="Staða rannsóknar og næstu skref">
                      {workingCase.investigationProgress}
                    </AccordionListItem>
                    <AccordionListItem title="Lagarök">
                      {workingCase.legalArguments}
                    </AccordionListItem>
                  </AccordionItem>
                  <AccordionItem id="id_2" label="Þingbók">
                    <Box marginBottom={2}>
                      <Text variant="h4" as="h4">
                        Upplýsingar
                      </Text>
                    </Box>
                    <Box marginBottom={1}>
                      <Text>
                        {`Þinghald frá kl. ${formatDate(
                          workingCase.courtStartTime,
                          TIME_FORMAT,
                        )} til kl. ${formatDate(
                          workingCase.courtEndTime,
                          TIME_FORMAT,
                        )} ${formatDate(workingCase.courtEndTime, 'PP')}`}
                      </Text>
                    </Box>
                    <AccordionListItem title="Krafa lögreglu">
                      {workingCase.policeDemands}
                    </AccordionListItem>
                    <AccordionListItem title="Viðstaddir">
                      {workingCase.courtAttendees}
                    </AccordionListItem>
                    <AccordionListItem title="Dómskjöl">
                      Rannsóknargögn málsins liggja frammi. Krafa lögreglu
                      þingmerkt nr. 1.
                    </AccordionListItem>
                    <AccordionListItem title="Réttindi kærða">
                      Kærða er bent á að honum sé óskylt að svara spurningum er
                      varða brot það sem honum er gefið að sök, sbr. 2. mgr.
                      113. gr. laga nr. 88/2008. Kærði er enn fremur áminntur um
                      sannsögli kjósi hann að tjá sig um sakarefnið, sbr. 1.
                      mgr. 114. gr. sömu laga.
                    </AccordionListItem>
                    <AccordionListItem title="Afstaða kærða">
                      {workingCase.accusedPlea}
                    </AccordionListItem>
                    <AccordionListItem title="Málflutningur">
                      {workingCase.litigationPresentations}
                    </AccordionListItem>
                  </AccordionItem>
                </Accordion>
              </Box>
              <Box component="section" marginBottom={8}>
                <Box marginBottom={2}>
                  <Text as="h4" variant="h4">
                    Úrskurður Héraðsdóms
                  </Text>
                </Box>
                <Box marginBottom={7}>
                  <Text variant="tag" color="blue400">
                    Niðurstaða úrskurðar
                  </Text>
                  <Text>{workingCase.ruling}</Text>
                </Box>
              </Box>
              <Box component="section" marginBottom={8}>
                <Box marginBottom={7}>
                  <Box marginBottom={2}>
                    <Text as="h4" variant="h4">
                      Úrskurðarorð
                    </Text>
                  </Box>
                  <Box marginBottom={3}>
                    <Text>{constructConclusion(workingCase)}</Text>
                  </Box>
                  <Text>
                    Úrskurðarorðið er lesið í heyranda hljóði að viðstöddum
                    kærða, verjanda hans, túlki og aðstoðarsaksóknara.
                  </Text>
                </Box>
              </Box>
              <Box component="section" marginBottom={8}>
                <Box marginBottom={10}>
                  <Box marginBottom={2}>
                    <Text as="h4" variant="h4">
                      Ákvörðun um kæru
                    </Text>
                  </Box>
                  <Box marginBottom={1}>
                    <Text>
                      {getAppealDecitionText(
                        AppealDecitionRole.ACCUSED,
                        workingCase.accusedAppealDecision,
                      )}
                    </Text>
                  </Box>
                  <Text>
                    {getAppealDecitionText(
                      AppealDecitionRole.PROSECUTOR,
                      workingCase.prosecutorAppealDecision,
                    )}
                  </Text>
                </Box>
              </Box>
              {uContext?.user && (
                <Box marginBottom={15}>
                  <Text variant="h3">
                    {`${uContext.user.name}, ${uContext.user.title}`}
                  </Text>
                </Box>
              )}
              <FormFooter
                nextUrl={Constants.DETENTION_REQUESTS_ROUTE}
                nextButtonText="Staðfesta úrskurð"
                onNextButtonClick={async () => {
                  // Set loading indicator on the Continue button in the footer
                  setIsLoading(true)

                  // Accept or reject case
                  await handleNextButtonClick()

                  // Request signature to get control code
                  const signature = await api.requestSignature(workingCase.id)

                  if (
                    signature.httpStatusCode >= 200 &&
                    signature.httpStatusCode < 300
                  ) {
                    setSignatureResponse(signature)
                    setModalVisible(true)
                    setIsLoading(false)

                    // Confirm requested signature
                    const confirmSignature = await api.confirmSignature(
                      workingCase.id,
                      signature.response.documentToken,
                    )

                    setConfirmSignatureResponse(confirmSignature)
                  }
                }}
                nextIsLoading={isLoading}
              />
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
      {modalVisible && (
        <Modal
          title={
            confirmSignatureResponse?.httpStatusCode >= 400
              ? confirmSignatureResponse?.code === 7023 // User cancelled
                ? 'Notandi hætti við undirritun'
                : 'Undirritun tókst ekki'
              : confirmSignatureResponse?.httpStatusCode >= 200 &&
                confirmSignatureResponse?.httpStatusCode < 300
              ? 'Úrskurður hefur verið staðfestur og undirritaður'
              : 'Rafræn undirritun'
          }
          text={
            confirmSignatureResponse?.httpStatusCode >= 400
              ? 'Vinsamlegast reynið aftur svo hægt sé að senda úrskurðinn með undirritun.'
              : confirmSignatureResponse?.httpStatusCode >= 200 &&
                confirmSignatureResponse?.httpStatusCode < 300
              ? 'Tilkynning um úrskurð hefur verið send á ákæranda, verjanda og fangelsi.'
              : renderContolCode()
          }
          primaryButtonText={
            !confirmSignatureResponse
              ? null
              : confirmSignatureResponse.httpStatusCode >= 200 &&
                confirmSignatureResponse.httpStatusCode < 300
              ? 'Loka glugga og fara í yfirlit krafna'
              : 'Loka og reyna aftur'
          }
          handlePrimaryButtonClick={async () => {
            if (
              confirmSignatureResponse.httpStatusCode >= 200 &&
              confirmSignatureResponse.httpStatusCode < 300
            ) {
              history.push(Constants.DETENTION_REQUESTS_ROUTE)
            } else {
              setModalVisible(false)
            }
          }}
        />
      )}
    </>
  ) : null
}

export default Confirmation
