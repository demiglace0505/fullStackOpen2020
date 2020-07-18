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

      cy.get('.notifError').should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in:', function () {
    beforeEach(function () {
      cy.login({ username: 'lain', password: 'lainPass123' })

    })

    //5.19
    it('A blog can be created', function () {
      cy.contains('new blog').click()
      cy.get('#title-input').type('test blog from cypress')
      cy.get('#author-input').type('LAIN')
      cy.get('#url-input').type('lain.xyz')
      cy.get('#createBlog-button').click()

      cy.get('.basicInfo').should('contain', 'test blog from cypress LAIN')
      // cy.contains('test blog from cypress LAIN')
    })

    // 5.20
    it('A blog post can be liked', function () {
      cy.createBlog({
        title: 'test blog for liking',
        author: 'test author',
        url: 'test.xyz',
        likes: 5
      })
      cy.createBlog({
        title: 'another test blog, NOT TO BE LIKED',
        author: 'test author',
        url: 'test.xyzsd',
        likes: 100
      })

      cy.get('.blogPost')
        .contains('test blog for liking').parent().as('targetBlog')
        .contains('view')
        .click()

      cy.get('@targetBlog')
        .contains('like')
        .click()

      cy.get('@targetBlog')
        .get('.likesInfo')
        .should('contain', 'likes: 6')
    })

    // 5.21
    describe('Deleting Blog posts', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'test blog, NOT FOR DELETION',
          author: 'test author',
          url: 'test.xyz',
          likes: 5
        })
        cy.createBlog({
          title: 'another test blog, THIS IS FOR DELETION',
          author: 'test author',
          url: 'test.xyzsd',
          likes: 100
        })
      })
      it('A blog post can be deleted', function () {
        cy.get('.blogPost')
          .contains('another test blog, THIS IS FOR DELETION').parent().as('targetBlog')
          .contains('view')
          .click()

        cy.get('@targetBlog')
          .contains('DELETE')
          .click()

        cy.get('.blogPost')
          .should('not.contain', 'another test blog, THIS IS FOR DELETION')
      })

      it('A blog post cannot be deleted  by other users', function () {
        cy.contains('logout')
          .click()

        const anotherUser = {
          name: 'anotherUser',
          username: 'anotherUser',
          password: 'anotherUserPass123'
        }
        cy.request('POST', 'http://localhost:3001/api/users', anotherUser)
        cy.visit('http://localhost:3000')
        cy.login({ username: 'anotherUser', password: 'anotherUserPass123' })

        cy.get('.blogPost')
          .contains('another test blog, THIS IS FOR DELETION').parent().as('targetBlog')
          .contains('view')
          .click()

        cy.get('@targetBlog')
          .get('.deleteButton')
          .should('have.css', 'display', 'none')
      })

    })

    // 5.22
    describe.only('Blogs are arranged according to number of likes', function () {
      beforeEach(function () {
        cy.login({ username: 'lain', password: 'lainPass123' })
        cy.createBlog({
          title: 'TOP BLOG',
          author: 'lain',
          url: 'lain.net',
          likes: 403742389
        })
        cy.createBlog({
          title: '3rd BLOG',
          author: 'lain',
          url: 'lain.net',
          likes: 5125
        })
        cy.createBlog({
          title: '2nd top BLOG',
          author: 'lain',
          url: 'lain.net',
          likes: 12567
        })
        cy.createBlog({
          title: 'sixth BLOG',
          author: 'lain',
          url: 'lain.net',
          likes: 0
        })
        cy.createBlog({
          title: '_4th BLOG',
          author: 'lain',
          url: 'lain.net',
          likes: 431
        })
        cy.createBlog({
          title: 'a 5th BLOG',
          author: 'lain',
          url: 'lain.net',
          likes: 7
        })
      })

      it('Blogs are arranged according to number of likes', function () {
        const blogs = cy.get('.blogPost')
        blogs[0].should('contain', 'TOP BLOG')
      })
    })
  })

})