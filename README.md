# import "@softwareasaservice/queue"

Maintain a queue in the cloud, for your Node/React/Nextjs App.

A zero dependency npm module, by reusing `fetch` in Nextjs. (on node, assumes you have installed `node-fetch`)

## Install

    # with yarn 
    yarn add @softwareasaservice/queue
    
    # or with npm
    npm install @softwareasaservice/queue


## Setup

    var q = new Queue({EMAIL:"your@email.com");
    
	 // if you have an Enterprise account, pass in your `APIKEY`
    var q = new Queue({EMAIL:"your@email.com", APIKEY:"skip_if_not_given_to_you"});

#### Settings

| option | value|
|--------|------|
|`EMAIL` | Your email |
|`APIKEY` | For enterprise customers|
|`maxBuffer` | `25`|
|`intervalInMs` | `5000`|
|`intervalInMs` | `5000`|


## Usage from Nextjs

    import {Queue} from "@softwareasaservice/queue";

    var q = new Queue({EMAIL:"your@email.com", APIKEY:"skip_if_not_given_to_you"},{
      onSuccess: (_, worked)=> {console.log('got', worked);},
      onError: (_, failed)=> {console.log('error:',failed);}
    });
    
    export default (req, res) => {
      q.add({a:1, b: [2,4], c: "str", someField: `apple${Date.now()}`})
    
      res.status(200).json(q.buff);
    }

## Usage from Node

Additional step for Node or an environment that does not have the `fetch` function

    # required for node
    yarn add node-fetch
    # or via npm 
    npm install node-fetch


Then continue with the setup

    const Queue = require("@softwareasaservice/queue").Queue;

    var q = new Queue({EMAIL:"your@email.com", APIKEY:"skip_if_not_given_to_you"},{
      onSuccess: (_, worked)=> {console.log('got', worked);},
      onError: (_, failed)=> {console.log('error:',failed);}
    });


## Adding to the queue
    
      // queue an object
      q.add(anyObject);

	   // queue the body from an express route handler
      q.add(req.body);
      
      // use any attributes you like, that can be JSON stringified
      q.add({a:1, b: [2,4], c: "str", someField: `apple${Date.now()}`})
      

## When does the queue sync to the cloud

Every 5 seconds. This is configurable via the `intervalInMs` that can be passed along with the `EMAIL` while creating the queue. The `maxBuffer` is `25`, that can also be passed in as an option.

## Events

#### No not listen for events

    var q = new Queue({EMAIL:"your@email.com");

#### Listen for events to your custom function rather than push to the cloud

    var q = new Queue({EMAIL:"your@email.com"},{
      debugger: (payload)=> {console.log('sending:', payload);}
    });


#### Listen for successfully sent items

    var q = new Queue({EMAIL:"your@email.com", {
      onSuccess: (err, payload)=> {console.log('sent:', worked);}
    });

#### Listen for errors

    var q = new Queue({EMAIL:"your@email.com"},{
      onError: (err, payload)=> {console.log('error:', failed);}
    });



## Licence
MIT

## Authors

importSaaS, a stealth startup that simplifies the SaaS journey for builders. 

Email `help@importsaas.com` to see how to self-host, share feedback, or to to say hello.