import { Button } from '@island.is/island-ui/core'
import React from 'react'
import { api } from '@island.is/judicial-system-web/src/services'

interface Props {
  caseId: string
  title: string
  pdfType: 'request' | 'courtRecord' | 'ruling' | 'custodyNotice'
  disabled?: boolean
}

const PdfButton: React.FC<Props> = ({ caseId, title, pdfType, disabled }) => {
  return (
    <Button
      data-testid={
        pdfType === 'courtRecord'
          ? 'courtRecordPDFButton'
          : pdfType === 'ruling'
          ? 'rulingPDFButton'
          : `${pdfType}PDFButton`
      }
      variant="ghost"
      size="small"
      icon="open"
      iconType="outline"
      disabled={disabled}
      onClick={() =>
        window.open(`${api.apiUrl}/api/case/${caseId}/${pdfType}`, '_blank')
      }
    >
      {title}
    </Button>
  )
}

export default PdfButton
