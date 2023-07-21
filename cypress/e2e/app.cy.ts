describe('Homepage', () => {
    it('Has our navbar home', () => {
        cy.visit('http://localhost:3000/')

        cy.get('a').contains('Home').parents().should('have.attr', 'href', '/');

        cy.get('a').contains('Challenges').parents().should('have.attr', 'href', '/challenges');

        cy.get('a').contains('Rankings').parents().should('have.attr', 'href', '/rankings');

        cy.get('a').contains('Sign in').parents().should('have.attr', 'href', '/api/auth/signin');
    })
})