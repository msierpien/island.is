import { rest } from 'msw'
import {
  VHSUCCESS,
  VHFAIL,
  SYSLUMENN_AUCTION,
  OPERATING_LICENSE,
  DATA_UPLOAD,
  OPERATING_LICENSE_SERVICE_RES,
} from './responses'

const url = (path: string) => {
  return new URL(path, 'http://localhost').toString()
}

export const requestHandlers = [
  rest.post(url('/v1/Innskraning'), (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ accessToken: '123', audkenni: '123' }),
    )
  }),
  rest.get(url('/v1/VirkarHeimagistingar/:id/:year'), (req, res, ctx) => {
    const success = req.params.id ? true : false
    if (success) {
      return res(ctx.status(200), ctx.json(VHSUCCESS))
    } else {
      return res(ctx.status(401), ctx.json(VHFAIL))
    }
  }),
  rest.get(url('/v1/VirkarHeimagistingar/:id'), (req, res, ctx) => {
    const success = req.params.id ? true : false
    if (success) {
      return res(ctx.status(200), ctx.json(VHSUCCESS))
    } else {
      return res(ctx.status(401), ctx.json(VHFAIL))
    }
  }),
  rest.get(url('/api/Uppbod/:id'), (req, res, ctx) => {
    const success = req.params.id ? true : false
    if (success) {
      return res(ctx.status(200), ctx.json(SYSLUMENN_AUCTION))
    } else {
      return res(ctx.status(401), ctx.json(VHFAIL))
    }
  }),
  rest.get(url('/api/VirkLeyfi/:id'), (req, res, ctx) => {
    const success = req.params.id ? true : false
    if (success) {
      return res(ctx.status(200), ctx.json(OPERATING_LICENSE_SERVICE_RES))
    } else {
      return res(ctx.status(401), ctx.json(VHFAIL))
    }
  }),
  rest.post(url('/api/v1/SyslMottakaGogn'), (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(DATA_UPLOAD))
  }),
]
