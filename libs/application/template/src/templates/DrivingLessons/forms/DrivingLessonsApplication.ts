import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildSection,
} from '../../../lib/formBuilders'
import {
  buildIntroductionField,
  buildRadioField,
  buildSelectField,
  buildTextField,
} from '../../../lib/fieldBuilders'
import { Form } from '../../../types/Form'
import { DataProviderTypes } from '../../../types/DataProvider'
import { ApplicationTypes } from '../../../types/ApplicationTypes'
import { m } from './messages'

const yesOption = { value: 'yes', label: m.yesOptionLabel }
const noOption = { value: 'no', label: m.noOptionLabel }

export const DrivingLessonsApplication: Form = buildForm({
  id: ApplicationTypes.DRIVING_LESSONS,
  ownerId: 'TODO?',
  name: 'Ökunám',
  children: [
    buildSection({
      id: 'student',
      name: m.studentSection,
      children: [
        buildMultiField({
          id: 'student',
          name: m.studentTitle,
          children: [
            buildTextField({
              id: 'student.name',
              name: m.studentName,
              disabled: false,
            }),
            buildTextField({
              id: 'student.parentEmail',
              name: m.parentEmail,
              disabled: false,
            }),
            buildTextField({
              id: 'student.nationalId',
              name: m.nationalId,
              disabled: false,
            }),
            buildTextField({
              id: 'student.phoneNumber',
              name: m.phoneNumber,
            }),
            buildTextField({
              id: 'student.address',
              name: m.address,
            }),
            buildTextField({
              id: 'student.zipCode',
              name: m.zipCode,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'type',
      name: m.typeSection,
      children: [
        buildRadioField({
          id: 'type',
          name: m.type,
          options: [
            {
              value: 'B',
              label: m.typeOption1Label,
              tooltip: m.typeOption1Tooltip,
            },
            {
              value: 'AM',
              label: m.typeOption2Label,
              tooltip: m.typeOption2Tooltip,
            },
            {
              value: 'A',
              label: m.typeOption3Label,
              tooltip: m.typeOption3Tooltip,
            },
            {
              value: 'A1',
              label: m.typeOption4Label,
              tooltip: m.typeOption4Tooltip,
            },
            {
              value: 'A2',
              label: m.typeOption5Label,
              tooltip: m.typeOption5Tooltip,
            },
            {
              value: 'T',
              label: m.typeOption6Label,
              tooltip: m.typeOption6Tooltip,
            },
          ],
        }),
        buildSelectField({
          id: 'teacher',
          name: m.teacher,
          placeholder: 'Veldu ökukennara',
          options: [
            {
              label: 'Ingólfur Jónsson (101)',
              value: '1',
            },
            {
              label: 'Hallveig Traustadóttir (105)',
              value: '2',
            },
            {
              label: 'Björn Egilsson (107)',
              value: '3',
            },
            {
              label: 'Auður Egilsdóttir (170)',
              value: '4',
            },
          ],
        }),
        buildSelectField({
          id: 'school',
          name: m.school,
          placeholder: 'Veldu ökuskóla',
          options: [
            {
              label: 'Harvard',
              value: '1',
            },
            {
              label: 'Oxford',
              value: '2',
            },
          ],
        }),
      ],
    }),
    buildSection({
      id: 'health',
      name: m.healthSection,
      children: [
        buildMultiField({
          id: 'eyeSight',
          name: m.eyeSight,
          children: [
            buildRadioField({
              id: 'useGlasses',
              name: m.useGlasses,
              options: [yesOption, noOption],
            }),
            buildRadioField({
              id: 'damagedEyeSight',
              name: m.damagedEyeSight,
              options: [yesOption, noOption],
            }),
            buildRadioField({
              id: 'limitedFieldOfView',
              name: m.limitedFieldOfView,
              options: [yesOption, noOption],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'fetchData',
      name: m.fetchDataSection,
      children: [
        buildExternalDataProvider({
          name: m.fetchData,
          id: 'fetchData',
          dataProviders: [
            buildDataProviderItem({
              id: 'passportImgAndSignature',
              title: m.passportImgAndSignatureTitle,
              subTitle: m.passportImgAndSignatureSubtitle,
              type: DataProviderTypes.ExampleSucceeds,
            }),
            buildDataProviderItem({
              id: 'healthInfo',
              title: m.healthInfoTitle,
              subTitle: m.healthInfoSubtitle,
              type: DataProviderTypes.ExampleSucceeds,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'payment',
      name: m.paymentSection,
      children: [
        buildIntroductionField({
          id: 'payment',
          name: m.payment,
          introduction: 'TODO IMPLEMENT',
        }),
      ],
    }),
    buildSection({
      id: 'confirmation',
      name: m.confirmationSection,
      children: [
        buildIntroductionField({
          id: 'overview',
          name: m.overview,
          introduction: 'TODO IMPLEMENT',
        }),
      ],
    }),
  ],
})
