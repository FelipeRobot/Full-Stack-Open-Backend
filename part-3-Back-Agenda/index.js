const express = require('express');
const app = express();

app.use(express.json());


let contacts= [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.get('/api/persons', (req, res)=>{

    res.send(contacts);

})

app.get('/info', (req, res) => {
    const numContacts = contacts.length;
    const currentTime = new Date().toString();
    
    // Respuesta HTML
    res.send(`
      <div>
        <p>Phonebook has info for ${numContacts} people.</p>
        <p>${currentTime}</p>
      </div>    
    `);
  });

app.get('/:id',(req,res)=>{
    
    const id = Number(req.params.id);

    try{
        if(id>contacts.length){
            res.status(404).json({
                error: 'Register not found',
                message: 'There is no register with that id'
            })
        }else{
            res.send(contacts[id]);
        }
        
    }catch(error){
        res.send('There was an issue calling the endpoint: ', error);
    }
})

app.delete('/:id',(req,res)=>{
    const id = Number(req.params.id);
    try{
        if(id>contacts.length){
            res.status(400).json({
                message: 'Register not found'
            })
        }else{
            contacts.splice(id, 1);
            res.status(200).json({
                message: 'Register deleted succesfully.'
            })
        }
    }catch(error){
        console.error('There was an error deleting the register: ', error);
        res.status(500).json({
            message: `There was an issue deleting the register. ${error}`
        });
    }

});

app.post('/persons/new',(req, res)=>{

    const body = req.body;

    console.log('Debug: ', req.body);
    try{
        if(Object.keys(body).length === 0){
           return res.status(400).json({
                message: 'The body of the request is emtpy. Verify the body.'
            });
        }else{
            if(verifyRequest(body)){
                try{
                    if(verifyUniqueName(body)){
                        console.log('Its unique');

                        body.id = generateId();
                        //contacts.push(body);

                        res.status(200).json({
                            message: 'POST succesfully executed.'
                        });


                    }else{
                        console.log('Its not');
                        res.status(400).json({
                            message : "There's already a contact with that name."
                        })

                    }

                }catch(error){
                    console.log('Theres was an error creating the register:', error);
                    return res.status(400).json({
                        message: 'There was an issue with the data. Verify the request.'
                    });
                }
            }else{
                return res.status(400).json({
                    message: 'The body of the request is empty either on the name or number.'
                });
            }

        }
    }catch(error){
        console.error('There was an error on the request:', error);
        return res.status(500).json({
            message : 'There was an error on the request.',
            error : error
        })
    }

});

const verifyRequest = (json)=>{
    if(!json.name && !json.number){
        return false;
    }else{
        return true;
    }
}

const generateId= ()=>{
    const maxId = contacts.length > 0
    ? Math.max(...contacts.map(n => n.id))
    : 0

    return maxId +1;
}


//pendiente: arreglar este verificador

const verifyUniqueName =(json)=>{
    const requestName = json.name;
    contacts.map(contact=>{
        if(requestName == contact.name){
            return false;
        }else{
            return true;
        }
    })
}

const PORT = 8080;
app.listen(PORT,()=>{

    console.log(`It's alive!!! on ${PORT}`);

});