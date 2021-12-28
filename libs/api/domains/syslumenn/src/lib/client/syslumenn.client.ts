import { HttpService, Inject, Injectable } from '@nestjs/common'
import { IHomestay } from './models/homestay'
import { ISyslumennAuction } from './models/syslumennAuction'
import { ILogin } from './models/login'
import {
  Person,
  Attachment,
  DataUploadResponse,
  SealedCriminalRecordResponse,
} from '../models/dataUpload'
import { constructUploadDataObject } from './models/dataUpload'
import { IOperatingLicense } from './models/operatingLicense'

export const SYSLUMENN_CLIENT_CONFIG = 'SYSLUMENN_CLIENT_CONFIG'

export interface SyslumennClientConfig {
  url: string
  username: string
  password: string
}

@Injectable()
export class SyslumennClient {
  private id = ''
  private accessToken = ''

  constructor(
    private httpService: HttpService,
    @Inject(SYSLUMENN_CLIENT_CONFIG)
    private clientConfig: SyslumennClientConfig,
  ) {}

  private async login() {
    const config = {
      notandi: this.clientConfig.username,
      lykilord: this.clientConfig.password,
    }

    const response: { data: ILogin } = await this.httpService
      .post(`${this.clientConfig.url}/v1/Innskraning`, config)
      .toPromise()

    this.id = response.data.audkenni
    this.accessToken = response.data.accessToken
  }

  async getHomestays(year?: number): Promise<IHomestay[] | null> {
    await this.login()

    const url = year
      ? `${this.clientConfig.url}/v1/VirkarHeimagistingar/${this.id}/${year}`
      : `${this.clientConfig.url}/v1/VirkarHeimagistingar/${this.id}`

    const response: { data: IHomestay[] } = await this.httpService
      .get(url)
      .toPromise()

    return response.data
  }

  async getSyslumennAuctions(): Promise<ISyslumennAuction[] | null> {
    await this.login()

    const url = `${this.clientConfig.url}/api/Uppbod/${this.id}`

    const headers = {
      'Content-type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    }

    const response: {
      data: ISyslumennAuction[]
    } = await this.httpService.get(url, { headers: headers }).toPromise()

    return response.data
  }

  async getOperatingLicenses(): Promise<IOperatingLicense[] | null> {
    await this.login()

    return (
      await this.httpService
        .get(`${this.clientConfig.url}/api/VirkLeyfi/${this.id}`)
        .toPromise()
    ).data
  }

  async uploadData(
    persons: Person[],
    attachment: Attachment,
    extraData: { [key: string]: string },
    uploadDataName: string,
    uploadDataId?: string,
  ): Promise<DataUploadResponse> {
    await this.login()

    const url = `${this.clientConfig.url}/api/v1/SyslMottakaGogn`

    const headers = {
      'Content-type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    }

    const request = JSON.stringify(
      constructUploadDataObject(
        this.id,
        persons,
        attachment,
        extraData,
        uploadDataName,
        uploadDataId,
      ),
    )

    const response: {
      data: DataUploadResponse
    } = await this.httpService
      .post(url, request, { headers: headers })
      .toPromise()
      .catch((err) => {
        throw err
      })

    return response.data
  }

  async sealCriminalRecord(
    criminalRecord: string,
  ): Promise<SealedCriminalRecordResponse> {
    await this.login()

    const headers = {
      'Content-type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    }

    const explination = 'Undirritað af sýslumanni'
    const url = `${this.clientConfig.url}/api/Innsiglun`

    const request = JSON.stringify({
      audkenni: this.id,
      skyring: explination,
      skjal: criminalRecord,
    })

    const response: {
      data: SealedCriminalRecordResponse
    } = await this.httpService
      .post(url, request, { headers: headers })
      .toPromise()
      .catch((err) => {
        throw err
      })

    return response.data
  }
}
