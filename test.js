const program = require('commander');
const request = require('request');
const pkg = require('./package.json');
const fs = require('fs');

const fullurl = (path = '') => {
    let url = `http://${program.host}:${program.port}/`;
    if (program.index) {
      url += program.index + '/';
      if (program.type) {
        url += program.type + '/';
      }
    }
    return url + path.replace(/^\/*/, '');
  };

program
  .version(pkg.version)
  .description(pkg.description)
  .option('-h, --host <hostname>', 'hostname [localhost]','localhost')
  .option('-p, --port <port>', 'port [port]','9200')
  .option('-j, --json', 'the discription of json')
  .option('-i, --index <name>','the name of Elasticsearch')
  .option('-t, --type <type>','the type of Elasticsearch')
  .option('-d, --id <number>', 'the id of the cd');


  program
  .command('url [path]')
  .description('generate the URL for the options and path (default is /)')
  .action((path = '/') => console.log(fullurl(path)));
  
  program
   .command('get [path]')
   .description('search in Elasticsearch')
   .action((path = '/') => {
       options = {
           url : fullurl(path),
           json : program.json
       };
       request(options, (err, res, body) => {
           if(program.json){
               console.log(JSON.stringify(err || body));
           }else{
               if(err)  throw err;
               else console.log(body);
           }
       });
   });

   program
    .command('create-index')
    .description('create an index')
    .action(() => {
        if(!program.index){
            console.log('need a index');
            return;
        }
        options ={
            url : fullurl(),
        }
        request.put(options, (err, res, body) => {
            if(program.json){
                console.log(JSON.stringify(err || body));
            }else{
                if(err)  throw err;
                else console.log(body);
            }
        });
    });

    program
  .command('put <file>')
  .description('read and perform put options from the specified file')
  .action(file => {
    fs.stat(file, (err, stats) => {
      if(err){
        if(program.json){
          console.log(JSON.stringify(err));
          return;
        }
        throw err;
      }
      if(!program.id){
        if(program.json){
          console.log(JSON.stringify(err))
          return;
        }
        throw err;
      }

      const options = {
        url : fullurl(program.id),
        json : true,
        header : {
          'content-type' : 'application/json'
        }
      }
      const req = request.put(options);
      const stream = fs.createReadStream(file);
      stream.pipe(req);
      req.pipe(process.stdout);
    });
  }
    
  );

  program
  .command('bulk <file>')
  .description('read and perform bulk options from the specified file')
  .action(file => {
    fs.stat(file, (err, stats) => {
      if (err) {
        if (program.json) {
          console.log(JSON.stringify(err));
          return;
        }
        throw err;
      }

      const options = {
        url: fullurl('_bulk'),
        json: true,
        headers: {
          'content-length': stats.size,
          'content-type': 'application/json',
        }
      };
      const req = request.post(options);

      const stream = fs.createReadStream(file);
      stream.pipe(req);
      req.pipe(process.stdout);
    });
  });
  
  program
   .command('delete-item')
   .description('delete some info of the list')
   .action( () => {
     if(!program.id){
       if(program.json){
         console.log(JSON.stringify({error : 'error'}));
         return ;
       }
       else{
         console.log('失败');
         return;
       }
    }
    console.log(program.id);
    options = {
      url : fullurl(program.id),
      json : true,
      headers : {
        'content-type' : 'application/json',
      }
    }
  
    
    program
     .command('delete-index')
     .description('delete index of the cluster')
     .action( () => {
       if(!program.index){
         const msg = 'no index selected';
         if(program.json){
           console.log(JSON.stringify(msg));
           return;
         }
         else{
           console.log(msg);
           return;
         }
       }
       request.del(fullurl(), (err, res, body) => {
         if(err){
           if(program.json){
             console.log(JSON.stringify(err));
             return
           }
           throw err;
         }

         if(program.json){
           console.log(JSON.stringify(body));
         }

         console.log(body);
       })
     });
    
    let req = request.del(options, (err, res, body) => {
      if(err){
        if(program.json){
          console.log(JSON.stringify(err));
          return
        }
        else{
          console.log(err);
          return
        }
      }
      console.log(JSON.stringify(body));
    });
    

   });
  

   program
    .command('list-indices')
    .alias('li')
    .description('show the list of the program')
    .action(() => {
      const path = program.json ? '_all' : '_cat/indices?v' ;
      request.get(fullurl(path), (err, res, body) => {
        if(err){
          if(program.json){
            console.log(JSON.stringify(err));
            return;
          }
          throw err;
        }

        if(program.json){
          console.log(JSON.stringify(body));
        }else{
          console.log(body);
        }
      });
    });
   program.parse(process.argv);

  if (!program.args.filter(arg => typeof arg === 'object').length) {
    program.help();
  }