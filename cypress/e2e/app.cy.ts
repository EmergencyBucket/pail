describe('Homepage', () => {
    it('Has our Discord', () => {
        cy.visit('http://localhost:3000/')

        cy.get('a').should('have.attr', 'href', 'https://discord.gg/JFbB4ZAPEu')
    })
})