describe('Homepage', () => {
    it('Has our navbar', () => {
        cy.visit('http://localhost:3000/')

        cy.get('a').contains('Home').parents().should('have.attr', 'href', '/');

        cy.get('a').contains('Challenges').parents().should('have.attr', 'href', '/challenges');
    })
})