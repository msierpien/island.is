import { FieldBaseProps } from '@island.is/application/core'
import React, { FC, useState, useMemo } from 'react'
import { FormOverviewInReview } from '../FormOverviewInReview'
import { InReviewSteps } from '../InReviewSteps'
import { UploadAttachmentsInReview } from '../UploadAttachmentsInReview'

type InReviewStepsProps = {
  field: {
    props: {
      isAssignee?: boolean
    }
  }
}

export const ReviewForm: FC<FieldBaseProps & InReviewStepsProps> = (props) => {
  const { application, field, refetch } = props
  const isAssignee = !!field.props.isAssignee
  const [state, setState] = useState('inReviewSteps')
  const showScreen = (state: string) => {
    switch (state) {
      case 'inReviewSteps':
        return (
          <InReviewSteps
            application={application}
            isAssignee={isAssignee}
            setState={setState}
          />
        )
      case 'uploadDocuments':
        return (
          <UploadAttachmentsInReview
            application={application}
            setState={setState}
            refetch={refetch}
          />
        )
      case 'overview':
        return (
          <FormOverviewInReview
            setState={setState}
            isAssignee={isAssignee}
            props={props}
          />
        )
      default:
        return (
          <InReviewSteps
            application={application}
            isAssignee={isAssignee}
            setState={setState}
          />
        )
    }
  }
  return showScreen(state)
}
