let app = require("express")();
let exhbs = require("express-handlebars");
let bodyparser = require("body-parser");
const methodOverride = require("method-override");
const redis = require("redis");

let client = redis.createClient();
client.on("connect",()=>{
    console.log("connected to redis");
})

//view
app.engine('handlebars', exhbs({ defaultLayout: "main"} ));
app.set("view engine", 'handlebars');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.use(methodOverride('_method'));

app.get('/',(req, res, next)=>{
    res.render("searchusers");
});
app.post("/user/search",(req, res, next)=>{
    let id = req.body.id;
    client.hgetall(id, (err, data)=>{
        if(!data) res.render("searchusers", { error: "user with id does not found" });
        else{
            data.id = id;
            res.render("userdetails",{
                user: data
            })
        }
    })
})

app.get("/users/add", (req, res, next)=>{
    res.render("addusers");
});

app.post("/user/add", (req, res, next)=>{
    let name = req.body.name;
    let phone = req.body.phone;
    let email = req.body.email;
    let id = req.body.id;

    client.hmset(id, [ 
            'name', name,
            'phone', phone,
            'email', email
        ], (error, reply)=>{
            if(error) console.log("err",error);
            else console.log("reply", reply);
            res.redirect("/")
        })
});


let  port = 4000;
app.listen(port,()=>{
        console.log('server started ', port);
})
