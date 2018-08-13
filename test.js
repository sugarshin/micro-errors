// TODO
import test from 'ava'
import { handleErrors, createError } from '.'

test('createError', t => {
  const originalError = new Error('Some error')
  const error = createError(400, 'Bad Request', originalError, {
    type: 'https://example.com/probs/invalid-format',
    detail: 'Something Reason',
    data: { foo: 'bar' },
  })
  t.is(error.toString(), 'Error: Bad Request')
  t.is(error.originalError, originalError)
  t.is(error.type, 'https://example.com/probs/invalid-format')
  t.is(error.statusCode, 400)
  t.is(error.title, 'Bad Request')
  t.is(error.detail, 'Something Reason')
  t.deepEqual(error.data, { foo: 'bar' })
})
