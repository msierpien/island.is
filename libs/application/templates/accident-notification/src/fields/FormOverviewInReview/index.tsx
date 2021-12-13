import {
  DefaultEvents,
  FieldBaseProps,
  getValueViaPath,
} from '@island.is/application/core'
import { Box, Button, Divider, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import React, { FC, useState } from 'react'
import { inReview, overview, thirdPartyComment } from '../../lib/messages'
import { ReviewApprovalEnum } from '../../types'
import { FormOverview } from '../FormOverview'
import { ConfirmationModal } from './ConfirmationModal'

interface FormOverviewInReviewProps {
  field: {
    props: {
      isAssignee: boolean
    }
  }
}

export const FormOverviewInReview: FC<
  FormOverviewInReviewProps & FieldBaseProps
> = ({ application, field, refetch, goToScreen }) => {
  const isAssignee = field?.props?.isAssignee || false
  const { formatMessage } = useLocale()
  const reviewApproval = getValueViaPath(
    application.answers,
    'reviewApproval',
    ReviewApprovalEnum.NOTREVIEWED,
  )
  const reviewComment = getValueViaPath(
    application.answers,
    'reviewComment',
    '',
  ) as string

  const [rejectModalVisibility, setRejectModalVisibility] = useState<boolean>(
    false,
  )
  const [approveModalVisibility, setApproveModalVisibility] = useState<boolean>(
    false,
  )
  const [comment, setComment] = useState<string>('')

  const shouldReview =
    isAssignee && reviewApproval === ReviewApprovalEnum.NOTREVIEWED

  const onBackButtonClick = () => {
    goToScreen && goToScreen('applicationStatusScreen')
  }
  const goToAttachmentScreen = () => {
    goToScreen && goToScreen('addAttachmentScreen')
  }
  const openRejectModal = () => {
    setRejectModalVisibility(true)
  }
  const openApproveModal = () => {
    setApproveModalVisibility(true)
  }
  return (
    <>
      <Text variant="h1" marginBottom={2}>
        {formatMessage(overview.general.sectionTitle)}
      </Text>
      <FormOverview
        field={field}
        application={application}
        goToScreen={() => null}
      />
      <Box display="flex" justifyContent="flexEnd" marginBottom={6}>
        <Button icon="attach" variant="utility" onClick={goToAttachmentScreen}>
          {formatMessage(overview.labels.missingDocumentsButton)}
        </Button>
      </Box>
      {shouldReview && (
        <Box marginBottom={6}>
          <Text variant="h4" paddingBottom={2}>
            {formatMessage(thirdPartyComment.general.title)}
          </Text>
          <Divider />
          <Text paddingY={2}>
            {formatMessage(thirdPartyComment.general.description)}
          </Text>
          <InputController
            id="reviewComment"
            textarea
            backgroundColor="blue"
            rows={10}
            maxLength={2000}
            label={formatMessage(thirdPartyComment.labels.comment)}
            placeholder={formatMessage(
              thirdPartyComment.labels.commentPlaceholder,
            )}
            onChange={(value) => setComment(value.target.value)}
          />
        </Box>
      )}
      {!shouldReview && isAssignee && reviewComment.length > 0 && (
        <Box marginBottom={6}>
          <Text variant="h5">
            {formatMessage(thirdPartyComment.labels.comment)}
          </Text>
          <Text>{reviewComment}</Text>
        </Box>
      )}
      <Divider />
      <Box display="flex" justifyContent="spaceBetween" paddingY={5}>
        <Button variant="ghost" onClick={onBackButtonClick}>
          {formatMessage(inReview.buttons.backButton)}
        </Button>
        {shouldReview && (
          <Box display="flex" justifyContent="spaceBetween">
            <Button
              icon="warning"
              colorScheme="destructive"
              onClick={openRejectModal}
            >
              {formatMessage(thirdPartyComment.buttons.reject)}
            </Button>
            <Box marginLeft={3}>
              <Button icon="checkmarkCircle" onClick={openApproveModal}>
                {formatMessage(thirdPartyComment.buttons.approve)}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
      <ConfirmationModal
        visibility={rejectModalVisibility}
        setVisibility={setRejectModalVisibility}
        title={formatMessage(inReview.confirmationModal.reject.title)}
        text={formatMessage(inReview.confirmationModal.reject.text)}
        buttonText={formatMessage(inReview.confirmationModal.reject.buttonText)}
        buttonColorScheme="destructive"
        defaultEvent={DefaultEvents.REJECT}
        application={application}
        comment={comment}
        refetch={refetch}
      />
      <ConfirmationModal
        visibility={approveModalVisibility}
        setVisibility={setApproveModalVisibility}
        title={formatMessage(inReview.confirmationModal.approve.title)}
        text={formatMessage(inReview.confirmationModal.approve.text)}
        buttonText={formatMessage(
          inReview.confirmationModal.approve.buttonText,
        )}
        buttonColorScheme="default"
        defaultEvent={DefaultEvents.APPROVE}
        application={application}
        comment={comment}
        refetch={refetch}
      />
    </>
  )
}
