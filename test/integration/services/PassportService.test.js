'use strict'
/* global describe, it */

const assert = require('assert')
const supertest = require('supertest')

describe('PassportService', () => {
  let request, token
  before((done) => {
    request = supertest('http://localhost:3000')
    request
      .post('/auth/local/register')
      .set('Accept', 'application/json') //set header for this test
      .send({username: 'jaumard', password: 'adminadmin', email: 'test@test.te'})
      .expect(200)
      .end((err, res) => {
        assert.equal(res.body.redirect, '/')
        // on mongoose ids aren't numeric, should change this test case
        // assert.equal(res.body.user.id, 1)
        token = res.body.token
        done(err)
      })
  })
  it('should exist', () => {
    assert(global.app.api.services['PassportService'])
    assert(global.app.services['PassportService'])
  })

  it('should insert a user on /auth/local/register', (done) => {
    request
      .post('/auth/local/register')
      .set('Accept', 'application/json') //set header for this test
      .send({username: 'jim', password: 'adminadmin'})
      .expect(200)
      .end((err, res) => {
        assert.equal(res.body.redirect, '/')
        // assert.equal(res.body.user.id, 2)
        assert.equal(res.body.user.username, 'jim')
        done(err)
      })
  })

  it('should return an error on missing passport for registration on /auth/local/register', (done) => {
    request
      .post('/auth/local/register')
      .set('Accept', 'application/json') //set header for this test
      .send({username: 'yoyo'})
      .expect(400)
      .end((err, res) => {
        done(err)
      })
  })

  it('should insert a user on /auth/local/register with form submit', (done) => {
    request
      .post('/auth/local/register')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send('username=jim2&password=adminadmin2')
      .set('Accept', 'application/json') //set header for this test
      .expect(200)
      .end((err, res) => {
        assert.equal(res.body.redirect, '/')
        // assert.equal(res.body.user.id, 3)
        assert.equal(res.body.user.username, 'jim2')
        done(err)
      })
  })


  it('should log a user on /auth/local', (done) => {
    request
      .post('/auth/local')
      .set('Accept', 'application/json') //set header for this test
      .send({email: 'test@test.te', password: 'adminadmin'})
      .expect(200)
      .end((err, res) => {
        assert.equal(res.body.redirect, '/')
        // assert.equal(res.body.user.id, 1)
        assert.equal(res.body.user.username, 'jaumard')
        assert(res.body.token)//JWT token
        done(err)
      })
  })

  it('should log a user on /auth/local with form submit', (done) => {
    request
      .post('/auth/local')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send('username=jim2&password=adminadmin2')
      .set('Accept', 'application/json') //set header for this test
      .expect(200)
      .end((err, res) => {
        assert.equal(res.body.redirect, '/')
        // assert.equal(res.body.user.id, 3)
        assert.equal(res.body.user.username, 'jim2')
        assert(res.body.token)//JWT token
        done(err)
      })
  })
  it('should retreive data on / with JWT token', (done) => {
    request
      .get('/')
      .set('Authorization', `JWT ${token}`)
      .set('Accept', 'application/json') //set header for this test
      .expect(200)
      .end((err, res) => {
        assert.equal(res.text, 'ok')
        done(err)
      })
  })
})
