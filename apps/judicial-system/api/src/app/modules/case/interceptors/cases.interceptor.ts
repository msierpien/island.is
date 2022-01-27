import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'

import { User } from '@island.is/judicial-system/types'

import { Case } from '../models'
import { transformCase } from './case.transformer'
import { maskCaseByUser } from './case.mask'

@Injectable()
export class CasesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Case[]> {
    const user: User = context.getArgByIndex(2)?.req?.user

    return next.handle().pipe(
      map((cases: Case[]) => {
        return cases.map((retCase) => {
          return maskCaseByUser(transformCase(retCase), user)
        })
      }),
    )
  }
}
