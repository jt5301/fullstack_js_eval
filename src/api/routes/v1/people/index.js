const statusCodes = require('../../../lib/httpStatusCodes')
const httpErrorMessages = require('../../../lib/httpErrorMessages')
const { database } = require('../../../lib/database')
const moment = require('moment')

module.exports = (api) => {
  /**
   * POST /v1/people
   * Create a new person
   */
  api.post('/', async (req, res, next) => {
    const newPerson = req.body
    try {
      const returnPerson = await database('people').insert(newPerson).returning('*')
      res.status(statusCodes.OK).json(returnPerson[0])
    } catch (error) {
      next(error)
    }
  })


  /**
   * GET /v1/people/:personID
   * Retrieve a person by their ID
   */
  api.get('/:personID', async (req, res) => {
    try {
      const person = await database('people').where({
        id: req.params.personID,
      }).select('*')
      if (person.length === 0) {
        return res.status(statusCodes.NotFound).json({})
      }
      res
        .status(statusCodes.OK)
        .json(person[0])
    } catch (error) {
      next(error)
    }
  })

  /**
   * GET /v1/people
   * Retrieve a list of people
   */
  api.get('/', async (req, res) => {
    try {
      const people = await database('people')
      res
        .status(200)
        .json(people)
    } catch (error) {
      next(error)
    }
  })

  /**
   * Do not modify beyond this point until you have reached
   * TDD / BDD Mocha.js / Chai.js
   * ======================================================
   * ======================================================
   */

  /**
   * POST /v1/people/:personID/addresses
   * Create a new address belonging to a person
   **/
  api.post('/:personID/addresses', async (req, res) => {
    const address = req.body
    address.person_id = req.params.personID
    try {
      const returnAddress = await database('addresses').insert(address).returning('*')
      res
        .status(statusCodes.OK)
        .json(returnAddress[0])
    } catch (error) {
      next(error)
    }
  })

  /**
   * GET /v1/people/:personID/addresses/:addressID
   * Retrieve an address by it's addressID and personID
   **/
  api.get('/:personID/addresses/:addressID', async (req, res) => {
    const personId = req.params.personID
    const addressId = req.params.addressID
    try {
      const address = await database('addresses').select('*').where({
        person_id: personId,
        id: addressId,
      }).whereNull('deleted_at')
      res
        .status(statusCodes.OK)
        .json(address[0])
    } catch (error) {
      res.status(statusCodes.NotFound).json({})
    }
  })

  /**
   * GET /v1/people/:personID/addresses
   * List all addresses belonging to a personID
   **/
  api.get('/:personID/addresses', async (req, res) => {
    const personId = req.params.personID
    try {
      const addresses = await database('addresses').select('*').where({
        person_id: personId,
      }).whereNull('deleted_at')
      res.status(200).json(addresses)
    } catch (error) {
      next(error)
    }
  })

  /**
   * BONUS!!!!
   * DELETE /v1/people/:personID/addresses/:addressID
   * Mark an address as deleted by it's personID and addressID
   * Set it's deleted_at timestamp
   * Update the previous GET endpoints to omit rows where deleted_at is not null
   **/
  api.delete('/:personID/addresses/:addressID', async (req, res) => {
    const personId = req.params.personID
    const addressId = req.params.addressID
    try {
      await database('addresses')
        .where({
          person_id: personId,
          id: addressId
        })
        .update({
          deleted_at: moment().toISOString()
        })
      const address = await database('addresses').select('*').where({
        person_id: personId,
        id: addressId,
      })
      res.status(202).json(address[0])
    } catch (error) {
      next(error)
    }

  })
}
