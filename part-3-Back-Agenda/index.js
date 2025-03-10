const express = require('express');
const app = express();

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
            message: 'There was an issue deleting the register. ${error}'
        });
    }

    
    


});




app.listen(8080);