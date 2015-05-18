# express-session-json-store
JSON file sessions store for Express

forked [https://github.com/darul75/express-session-json] for **NOT** saving the json file on every request (instead: having a timeout and write the file if there are changes).


## Usage

express version >= 4

```javascript
var express = require('express'),
    cookieParser = require('cookie-parser'),
    session = require('express-session') ,
    JsonStore = require('express-session-json-store')(session);

var app = express();
app.use(cookieParser('your secret here'));
app.use(session({
    secret: 'your secret here' ,
    resave: false,
    saveUninitialized: false,
    store: new JsonStore()
});

```

Example for express < 4:

```javascript
var express = require('express'),
    JsonStore = require('express-session-json')(express.session);

var app = express();
app.configure(function(){    
    app.use(express.cookieParser('your secret here'));
    app.use(express.session({ store: new JsonStore({save}) }));
});

```


## Options

- **filename** : filename, default 'sessions.json'
- **path** : directory where to save, default './sessions'
- **ttl** : how long is the session valid in milliseconds, default 60min
- **saveInterval** : save every xx if something changed in milliseconds, default 5min


## License

The MIT License (MIT)

Copyright (c) 2013 Julien Valéry

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
