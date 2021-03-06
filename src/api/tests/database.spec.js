const fixtures = require('./fixtures')
const httpStatusCodes = require('../lib/httpStatusCodes')
const { client } = require('./setup/supertestServer')
const { expect } = require('chai')

function hasPersonKeys(res) {
  const keys = ['first_name', 'last_name', 'company', 'created_at', 'id', 'title']
  keys.map(key => { if (!res.body[key]) throw new Error(`Response missing ${key}`) })
}

function hasAddressKeys(res) {
  const keys = ['id', 'person_id', 'line1', 'line2', 'city', 'state', 'zip', 'created_at',]
  keys.map(key => { if (!res.body[key]) throw new Error(`Response missing ${key}`) })
}

describe('People API', () => {
  it('POST /v1/people should create a new person', async () => {
    await client
      .post('/v1/people')
      .send(fixtures.firstPerson)
      .expect(httpStatusCodes.OK)
      .expect(hasPersonKeys)
      .then(resp => {
        fixtures.firstPerson = resp.body
      })
  })

  it('GET /v1/people/:personID should return a 200 with an object of the person with that id', async () => {
    await client
      .get(`/v1/people/${fixtures.firstPerson.id}`)
      .expect(httpStatusCodes.OK, fixtures.firstPerson)
  })

  it('GET /v1/people/:personID should return a 404 when an incorrect id is used', async () => {
    await client
      .get(`/v1/people/99999999`)
      .expect(httpStatusCodes.NotFound)
  })

  it('GET /v1/people should return a 200 with an array of people objects', async () => {
    await client
      .get('/v1/people')
      .expect('Content-Type', fixtures.contentTypes.json)
      .expect(httpStatusCodes.OK)
      .then(resp => {
        expect(resp.body).to.have.lengthOf.above(0)

      })
  })

  /**
   * Do not modify above this line (use them as a reference point)
   * Do not modify beyond this point until you have reached
   * TDD / BDD Mocha.js / Chai.js
   * ======================================================
   * ======================================================
   */

  it('POST /v1/people/:personID/addresses should create a new address', async () => {
    await client
      .post(`/v1/people/${fixtures.firstPerson.id}/addresses`)
      .send(fixtures.newAddress)
      .expect('Content-Type', fixtures.contentTypes.json)
      .expect(httpStatusCodes.OK)
      .expect(hasAddressKeys)
      .then((response) => {
        expect(response.body).to.have.keys('id', 'person_id', 'line1', 'line2', 'city', 'state', 'zip', 'created_at', 'updated_at', 'deleted_at')
        fixtures.newAddress = response.body
      })
  })
  it('GET /v1/people/:personID/addresses/:addressID should return an address by its id and its person_id', async () => {
    await client
      .get(`/v1/people/${fixtures.firstPerson.id}/addresses/${fixtures.newAddress.id}`)
      .then((response) => {
        expect(response.body.person_id).to.equal(fixtures.newAddress.person_id)
        expect(response.body.id).to.equal(fixtures.newAddress.id)
      })
  })

  it('GET /v1/people/:personID/addresses should return a list of addresses belonging to the person by that id', async () => {
    await client
      .get(`/v1/people/${fixtures.firstPerson.id}/addresses`)
      .expect(httpStatusCodes.OK)
      .expect('Content-Type', fixtures.contentTypes.json)
      .then((response) => {
        expect(response.body.length).to.equal(1)
      })
  })

  // BONUS!!!
  it('DELETE /v1/people/:personID/addresses/:addressID should delete an address by its id (BONUS)', async () => {
    await client
      .delete(`/v1/people/${fixtures.firstPerson.id}/addresses/${fixtures.newAddress.id}`)
      .then((response) => {
        expect(response.body.deleted_at).to.not.equal(null)
      })
  })
})
