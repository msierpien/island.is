import { uuid } from 'uuidv4'
import { Person, Attachment, PersonType } from '../../models/dataUpload'
export interface IDataUpload {
  audkenni: string
  gognSkeytis: {
    audkenni: string
    skeytaHeiti: string
    adilar: DataUploadPerson[]
    attachments: File[]
    gagnaMengi: object
  }
}

interface DataUploadPerson {
  id: string
  nafn: string
  kennitala: string
  simi?: string
  heimilisfang: string
  tolvupostur?: string
  postaritun: string
  sveitafelag: string
  undirritad: boolean
  tegund?: number
}

interface File {
  nafnSkraar: string
  innihaldSkraar: string
}

enum ChildrenTransferPersonType {
  Malshefjandi = 0,
  Gagnadili = 1,
  Barn = 2,
}

enum CriminalRecordPersonType {
  Applicant = 0,
}

export function constructUploadDataObject(
  id: string,
  persons: Person[],
  attachment: Attachment,
  extraData: { [key: string]: string },
  uploadDataName: string,
  uploadDataId?: string,
): IDataUpload {
  return {
    audkenni: id,
    gognSkeytis: {
      audkenni: uploadDataId || uuid(),
      skeytaHeiti: uploadDataName,
      adilar: persons.map((p) => {
        return {
          id: uuid(),
          nafn: p.name,
          kennitala: p.ssn,
          simi: p.phoneNumber,
          tolvupostur: p.email,
          heimilisfang: p.homeAddress,
          postaritun: p.postalCode,
          sveitafelag: p.city,
          undirritad: p.signed,
          tegund: mapPersonEnum(p.type),
        }
      }),
      attachments: [
        { nafnSkraar: attachment.name, innihaldSkraar: attachment.content },
      ],
      gagnaMengi: extraData,
    },
  }
}

function mapPersonEnum(type: PersonType): number | undefined {
  switch (type) {
    case PersonType.Plaintiff:
      return ChildrenTransferPersonType.Malshefjandi
    case PersonType.CounterParty:
      return ChildrenTransferPersonType.Gagnadili
    case PersonType.Child:
      return ChildrenTransferPersonType.Barn
    case PersonType.CriminalRecordApplicant:
      return CriminalRecordPersonType.Applicant
  }
}
