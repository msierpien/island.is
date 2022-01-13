/// <reference path="../../../support/index.d.ts" />

import { Case, CaseDecision } from '@island.is/judicial-system/types'
import { makeCustodyCase } from '@island.is/judicial-system/formatters'
import { intercept } from '../../../utils'

describe('/domur/urskurdur/:id', () => {
  beforeEach(() => {
    cy.stubAPIResponses()
  })

  it('should autofill prosecutor demands', () => {
    const caseData = makeCustodyCase()
    const caseDataAddition: Case = {
      ...caseData,
      caseFacts: 'lorem ipsum',
      legalArguments: 'lorem ipsum',
      demands:
        'Þess er krafist að Donald Duck, kt. 000000-0000, sæti gæsluvarðhaldi með úrskurði Héraðsdóms Reykjavíkur, til miðvikudagsins 16. september 2020, kl. 19:50, og verði gert að sæta einangrun á meðan á varðhaldi stendur.',
    }
    cy.visit('/domur/urskurdur/test_id_stadfest')

    intercept(caseDataAddition)

    cy.getByTestid('prosecutorDemands').contains(
      'Þess er krafist að Donald Duck, kt. 000000-0000, sæti gæsluvarðhaldi með úrskurði Héraðsdóms Reykjavíkur, til miðvikudagsins 16. september 2020, kl. 19:50, og verði gert að sæta einangrun á meðan á varðhaldi stendur.',
    )
  })

  it('should require a valid ruling', () => {
    const caseData = makeCustodyCase()
    const caseDataAddition: Case = {
      ...caseData,
      caseFacts: 'lorem ipsum',
      legalArguments: 'lorem ipsum',
      demands:
        'Þess er krafist að Donald Duck, kt. 000000-0000, sæti gæsluvarðhaldi með úrskurði Héraðsdóms Reykjavíkur, til miðvikudagsins 16. september 2020, kl. 19:50, og verði gert að sæta einangrun á meðan á varðhaldi stendur.',
    }
    cy.visit('/domur/urskurdur/test_id_stadfest')

    intercept(caseDataAddition)

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000)
    cy.getByTestid('ruling')
      .contains('héraðsdómari kveður upp úrskurð þennan.')
      .clear()
    cy.clickOutside()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('ruling').type('lorem')
    cy.getByTestid('inputErrorMessage').should('not.exist')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    const caseData = makeCustodyCase()
    const caseDataAddition: Case = {
      ...caseData,
      caseFacts: 'lorem ipsum',
      legalArguments: 'lorem ipsum',
      demands:
        'Þess er krafist að Donald Duck, kt. 000000-0000, sæti gæsluvarðhaldi með úrskurði Héraðsdóms Reykjavíkur, til miðvikudagsins 16. september 2020, kl. 19:50, og verði gert að sæta einangrun á meðan á varðhaldi stendur.',
    }
    cy.visit('/domur/urskurdur/test_id_stadfest')

    intercept(caseDataAddition)

    cy.getByTestid('ruling').type('lorem')
    cy.get('#case-decision-accepting').check()
    cy.getByTestid('continueButton').click()
    cy.url().should('include', '/domur/urskurdarord/test_id_stadfest')
  })

  it('should show appropriate valid to dates based on decision', () => {
    const caseData = makeCustodyCase()
    const caseDataAddition: Case = {
      ...caseData,
      caseFacts: 'lorem ipsum',
      legalArguments: 'lorem ipsum',
      demands:
        'Þess er krafist að Donald Duck, kt. 000000-0000, sæti gæsluvarðhaldi með úrskurði Héraðsdóms Reykjavíkur, til miðvikudagsins 16. september 2020, kl. 19:50, og verði gert að sæta einangrun á meðan á varðhaldi stendur.',
    }
    cy.visit('/domur/urskurdur/test_id_stadfest')

    intercept(caseDataAddition)

    cy.getByTestid('caseDecisionSection').should('not.exist')
    cy.get('#case-decision-accepting').check()
    cy.getByTestid('caseDecisionSection').should('exist')
    cy.get('#case-decision-rejecting').check()
    cy.getByTestid('caseDecisionSection').should('not.exist')
    cy.get('#case-decision-accepting-partially').check()
    cy.getByTestid('caseDecisionSection').should('exist')
  })

  it('should have a disabled isolationTo datepicker if isolation is nor selected and not if it is', () => {
    const caseData = makeCustodyCase()
    const caseDataAddition: Case = {
      ...caseData,
      decision: CaseDecision.ACCEPTING,
      isCustodyIsolation: true,
    }
    cy.visit('/domur/urskurdur/test_id_stadfest')

    intercept(caseDataAddition)

    cy.get('#isolationToDate').should('not.have.attr', 'disabled')
    cy.get('[name="isCustodyIsolation"]').uncheck()
    cy.get('#isolationToDate').should('have.attr', 'disabled')
  })
})
