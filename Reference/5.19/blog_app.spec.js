describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const testUser = {
      name: 'lain TEST',
      username: 'lain',
      password: 'lainPass123'
    }
    cy.request('POST', 'http://localhost:3001/api/users', testUser)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.get('h1').contains('log in to application')
  })

  //5.18
  describe('Logging in', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username-input').type('lain')
      cy.get('#password-input').type('lainPass123')
      cy.get('#login-button').click()

      cy.contains('lain TEST is logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username-input').type('lain')
      cy.get('#password-input').type('WRONG PASS')
      cy.get('#login-button').click()

      cy.get('.notifError').should('contain','wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe.only('When logged in:', function () {
    beforeEach(function () {
      cy.login({username: 'lain', password: 'lainPass123'})
    })

    it('A blog can be created', function () {
      cy.contains('new blog').click()
      cy.get('#title-input').type('test blog from cypress')
      cy.get('#author-input').type('LAIN')
      cy.get('#url-input').type('lain.xyz')
      cy.get('#createBlog-button').click()

      cy.get('.basicInfo').should('contain', 'test blog from cypress LAIN')
      // cy.contains('test blog from cypress LAIN')
    })
  })
})