var faunadb = require('faunadb');
var q = faunadb.query;

function GetPin (code) {
  const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET })

  // with helper: const helper = client.paginate(q.Match(q.Index('find_pin'), code))
  // then helper.map(function(ref) { return q.Get(ref)})
  const findPin = client.query(
    q.Map(
      q.Paginate(q.Match(q.Index('find_pin'), code)),
      q.Lambda('X', q.Get(q.Var('X')))
    )
  )
  .then((function(response) {
    console.log(response)
    return { statusCode: 200, body: response }
  }))
}

exports.handler = function (event, context, callback) {

  const methodNotAllowed = { statusCode: 522, headers: { allow: 'GET' }, body: 'Request method not permitted.' }
  const codeRequired = { statusCode: 400, body: 'Parameter "code" is required.'}

  if(event.httpMethod !== 'GET') { callback(null, methodNotAllowed) }
  if(!event.queryStringParameters.code) { callback(null, codeRequired) }

  const result = GetPin(event.queryStringParameters.code)
  callback(null, result)
}
