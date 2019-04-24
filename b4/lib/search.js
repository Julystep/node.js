const request = require('request');
module.exports = (app, es) => {

  const url = `http://${es.host}:${es.port}/${es.books_index}/book/_search`;
  
  app.get('/api/search/books/:field/:query', (req, res) => {
 
    const esReqBody = {
      size: 10,
      query: {
        match: {
          [req.params.field]: req.params.query
        }
      },
    };

    const options = {url, json: true, body: esReqBody};
    request.get(options, (err, esRes, esResBody) => {                             //回调函数

      if (err) {
        res.status(502).json({
          error: 'bad_gateway',
          reason: err.code,
        });
        return;
      }

      if (esRes.statusCode !== 200) {
        res.status(esRes.statusCode).json(esResBody);
        return;
      }

      res.status(200).json(esResBody.hits.hits.map(({_source}) => _source));
    });

  });

  app.get('/api/suggest/:filed/:query', (req, res) => {
    const esReqBody = {                                           //搜索语句
      size : 0, 
      suggest : {
        suggestions : {
          text: req.params.query,
          term : {
            field:req.params.filed,
            suggest_mode: 'always',
          },
        }
      }
    };

    const options = {
        url,
        json : true,
        body : esReqBody
    };

    const promise = new Promise((resolve, reject) => {
      request.get(options,(err, esRes, esResBody) => {
        if(err){
          console.log('wrong1');
          reject({error:err});
          return;
        }
        if(esRes.statusCode !== 200){
          console.log('wrong2');
          reject({error:esResBody})
        }

        resolve(esResBody);
      });
    });
    promise
      .then(esResBody => res.status(200).json(esResBody.suggest.suggestions))
      .catch(({error}) => res.status(err.status || 502).json(error));


  });

}