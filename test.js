import test from 'ava'
import * as mocksHttp from 'node-mocks-http'
import { stub } from 'sinon'
import { handleErrors, createError } from '.'

const getError = error => createError(
  400,
  'Bad Request',
  error,
  'https://example.com/probs/invalid-format',
  {
    detail: 'Something Reason',
    foo: 'bar',
  }
)

test('createError', t => {
  const originalError = new Error('Some error')
  const error = getError(originalError)
  t.is(error.toString(), 'Error: Bad Request')
  t.is(error.originalError, originalError)
  t.is(error.type, 'https://example.com/probs/invalid-format')
  t.is(error.statusCode, 400)
  t.is(error.title, 'Bad Request')
  t.deepEqual(error.details, { detail: 'Something Reason', foo: 'bar' })
})

test('handleErrors', async t => {
  const req = mocksHttp.createRequest({
    method: 'GET',
    url: '/users/123',
    params: { id: 123 },
  })
  const res = mocksHttp.createResponse()
  const error = getError()
  const mockFn = stub().throws(error)

  await handleErrors()(mockFn)(req, res)
  t.is(res.statusCode, 400)
  t.deepEqual(JSON.parse(res._getData()), {
    detail: 'Something Reason',
    foo: 'bar',
    type: 'https://example.com/probs/invalid-format',
    title: 'Bad Request',
    status: 400,
    instance: '/users/123',
  })
})
