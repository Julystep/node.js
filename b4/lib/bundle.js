const rp = require('request-promise');

module.exports = (app, es) => {
    
    const url = `http://${es.host}:${es.port}/${es.bundles_index}/bundle`;

    app.post('/api/bundle', (req, res) => {
        const bundle = {
            title : req.query.title || '',
            CDs : [],
        };

        rp.post({url, json : true, body : bundle})
         .then(esResBody => res.status(200).json(esResBody))
         .catch(({error}) => res.status(err.status || 502).json(error));
    });

    app.get('/api/bundle/:id', async (req, res) => {                     //其他事件在promise响应式不停止，而同步是会停止的
        const options = {
            url : `${url}/${req.params.id}`,
            json : true,
        };

        try{
            const esResBody = await rp(options);
            res.status(200).json(esResBody);
        }catch(esResErr){
            res.status(esResErr.statusCode || 502).json(esResErr.err);
        }
    });

    app.put('/api/bundle/:id/title/:title', async (req, res) => {
       
       const  burl  = `${url}/${req.params.id}`;
       try{
           const bundle = (await rp({url : burl, json : true}))._source;
           bundle.title = req.params.title;

           const esResBody =
             await rp.put({url : burl, body : bundle, json : true});
             res.status(200).json(esResBody);
       }catch(esResErr){
           res.status(esResErr.statusCode || 502).json(esResErr.error);
       }

    });

    app.put('/api/bundle/:id/book/:pgid', async (req, res) => {
        const bundleUrl = `${url}/${req.params.id}`;
        //console.log(bundleUrl);

        const bookUrl = `http://${es.host}:${es.port}` + `/${es.books_index}/book/${req.params.pgid}`;
        //console.log(bookUrl);

        try{
            const [bundleRes, bookRes] = await Promise.all([
                rp({url : bundleUrl, json : true}),
                rp({url : bookUrl, json : true}),
            ]);
            const {_source : bundle, _version : version} = bundleRes;
            const {_source : cd} = bookRes;

            


            const idx = bundle.CDs.findIndex(cd => cd.id === req.params.pgid);   //利用Array的findIndex查询是否存在要插入的元素
            
        
            if(idx === -1){
                bundle.CDs.push({
                    id : req.params.pgid,
                    artist : cd.artist,
                });     
            }
            const esResBody = await rp.put({
                url : bundleUrl,
                body : bundle,
                json : true,
            });

            res.status(200).json(esResBody);

        }catch(esResErr){
            res.status(esResErr.statusCode || 502).json(esResErr.error);
        }
    });
}