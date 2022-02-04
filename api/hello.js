/*const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
    try{
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    }catch(err){console.error(err)}
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}*/


export default function handler(req, res){
    res.statusCode = 200;
    res.json({ url: "https://cdn-prd.content.metamorphosis.com/wp-content/uploads/sites/2/2020/06/fear-aggression-in-dogs-2-1.jpg"});
  }

//module.exports = allowCors(handler)
