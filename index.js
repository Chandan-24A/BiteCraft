import express from "express";
import pg from "pg";
import axios from "axios";
import bodyParser from "body-parser";
import env from "dotenv";
import bcrypt, {hash} from "bcrypt";
import passport from "passport";   
import { Strategy } from "passport-local"; 
import flash from "connect-flash";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";

env.config();
const app = express();
const port = process.env.PORT || 3000;
const saltRounds = 10;

const PgSession = connectPgSimple(session);

 const db = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:{
        rejectUnauthorized:false,
    },
 });

 const isProduction = process.env.NODE_ENV === "production";

app.set("trust proxy",1);

app.use(
    session({
        store: new PgSession({
            pool: db,
            tableName: "user_sessions",
            createTableIfMissing: true,
        }),

        secret: process.env.SESSION_SECRET,

        resave: false,

        saveUninitialized: false,

        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            secure: isProduction,   
            sameSite: "lax",
        },
    })
);

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended : true}));

app.use(passport.initialize());

app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.get("/register", async(req,res)=>{
    res.render("register.ejs");
});

app.get("/login",async(req,res)=>{
  res.render("login.ejs");
});

// home route

app.get("/",async (req,res)=>{
    if(req.isAuthenticated()){
        return res.redirect("/search");
    }
    res.render("home.ejs");
});

// recipes route

app.get("/search",async(req,res,next)=>{
    if(req.isAuthenticated()){
       const uid = req.user.id;
       try{
        const items = await db.query("SELECT ingredient FROM pantry WHERE userId = $1",[uid]);
        res.render("search.ejs",{pantry:items.rows.length>0});
       }catch(err){

          next(err);
       }
    }else{
        res.render("login.ejs");
    }
});
app.get("/recipes/pantry",async(req,res,next)=>{
    const uid = req.user.id;
    try{
        const items = await db.query("SELECT ingredient FROM pantry WHERE userId = $1", [uid]);
        const ingredients = items.rows.map((item)=> item.ingredient).join(",");

        const result = await axios.get("https://api.spoonacular.com/recipes/findByIngredients",{
            params:{
               ingredients:ingredients,
               number: 10,
               ranking: 1,
               ignorePantry: true,
               apiKey:process.env.API_KEY
            }
        });

        res.render("recipes.ejs",{recipes:result.data});
    }catch(err){

        next(err);
    }
});

app.post("/recipes",async (req,res,next)=>{
    const ingredients = req.body.items;

    try{
        const result = await axios.get("https://api.spoonacular.com/recipes/findByIngredients",{
            params:{
               ingredients:ingredients,
               number: 10,
               ranking: 1,
               ignorePantry: true,
               apiKey:process.env.API_KEY
            }
        });

        res.render("recipes.ejs",{recipes:result.data});
    }catch(err){

        next(err);
    }
});

app.get("/recipes/:id",async (req,res,next)=>{
        const userId = req.params.id;

        try{    
            const result = await axios.get(`https://api.spoonacular.com/recipes/${userId}/information`,{
                params:{
                    apiKey:process.env.API_KEY
                }
            });

            res.render("info.ejs",{information:result.data});

        }catch(err){

            next(err);
        }
});

//pantry route

app.get("/pantry",async (req,res,next)=>{
    const userId = req.user.id;

    try{
        const result = await db.query("SELECT * FROM pantry WHERE userId = $1",[userId]);
    
        res.render("pantry.ejs",{pantry:result.rows});

    }catch(err){

        next(err);
    }
});

app.post("/pantry/add",async(req,res,next)=>{
    const ingredient = req.body.item;
    const userId = req.user.id;

    try{
       const existing = await db.query("SELECT * FROM pantry WHERE userId=$1 AND LOWER(ingredient)=LOWER($2)",[userId, ingredient]);

       if(existing.rows.length > 0){
           return res.redirect("/pantry");
       }
       await db.query("INSERT INTO pantry(userId,ingredient) VALUES  ($1,$2)",[userId,ingredient]);

       res.redirect("/pantry");
    }catch(err){

        next(err);
    }
});

app.post("/pantry/delete/:id",async(req,res,next)=>{
    const uid = req.params.id;
    const userId = req.user.id;
    try{
        await db.query("DELETE FROM pantry WHERE id = $1 AND userId = $2",[uid,userId]);
        res.redirect("/pantry");
    }catch(err){

        next(err);
    }
});

//plannar route

app.get("/plannar",async(req,res,next)=>{
    const uid = req.user.id;
    const currDate = new Date();
    const week = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const day = week[currDate.getDay()];

    try{
        const meals = await db.query("SELECT * FROM plannar WHERE userId = $1 AND LOWER(day) = LOWER($2)",[uid,day]);

        res.render("plannar.ejs",{plan:meals.rows,date:day});
    }catch(err){

        next(err);
    }
});

app.post("/plannar/add",async(req,res,next)=>{
    const week = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const uid = req.user.id;
    const currDate = new Date();
    const day = week[currDate.getDay()];
    
    try{
        for(let j = 0;j<3;j++){
            const mealType = req.body.mt[j];
            const mealName = req.body.mn[j];

            if(mealName.trim() === "") continue;

            await db.query("INSERT INTO plannar(userid,day,mealtype,mealname) VALUES($1,$2,$3,$4)",[uid,day,mealType,mealName]);
        }
        res.redirect("/plannar");
    }catch(err){

        next(err);
    }
});

app.post("/plannar/update/:day/:mealtype",async(req,res,next)=>{
    const uid = req.user.id;
    const day = req.params.day;
    const mt = req.params.mealtype;
    const umn = req.body.updatemeal;

    if(umn === "" || umn.trim() === ""){
        return res.redirect("/plannar");
    }

    try{
        await db.query("UPDATE plannar SET mealname = $1 WHERE userid = $2 AND Lower(day) = Lower($3) AND LOWER(mealtype) = LOWER($4)",[umn,uid,day,mt]);
        res.redirect("/plannar");
    }catch(err){

        next(err);
    }


});

app.get("/plannar/:recipe",async(req,res,next)=>{
    const name = req.params.recipe;

    try{
        const result = await axios.get("https://api.spoonacular.com/recipes/complexSearch",{
            params:{
                query:name,
                number:1,
                apiKey:process.env.API_KEY
            }
        });

        if(result.data.results.length === 0){

            return res.status(404).render("404.ejs");
        }

        const id = result.data.results[0].id;

        return res.redirect(`/recipes/${id}`);

    }catch(err){

        next(err);
    }
});

//search recipes nav route

app.get("/search/recipes",async(req,res,next)=>{
    const name = req.query.recipe;

    try{
        const result = await axios.get("https://api.spoonacular.com/recipes/complexSearch",{
            params:{
                query:name,
                number:10,
                apiKey:process.env.API_KEY
            }
        });

        res.render("search-recipe.ejs",{meals:result.data.results});
    }catch(err){
        
        next(err);
    }
})

// authentication route

app.get("/logout",async(req,res,next)=>{
    req.logout((err)=>{
            if(err){
                return next(err);
            }
            req.session.destroy((err)=>{
                if(err){
                    return next(err);
                }

                res.clearCookie("connect.sid");
                res.redirect("/");
            });
    });
})

app.post("/login",passport.authenticate("local",{
    successRedirect:"/search",
    failureRedirect:"/login",
}));

app.post("/register",async (req,res)=>{
    const email = req.body.username;
    const password = req.body.password;

    try{
        const result = await db.query("SELECT * FROM users WHERE email = $1",[email]);
        if(result.rows.length>0){
            req.flash("error","Email already registered. Please login.");
            return res.redirect("/login");
        }else{
            bcrypt.hash(password,saltRounds,async (err,hash)=>{
                if(err){
                    console.error("Error in hashing password");
                }else{
                    const result = await db.query("INSERT INTO users(email,password) VALUES ($1,$2) RETURNING *",[email,hash]);
                    const user = result.rows[0];
                    req.login(user,(err)=>{
                        console.log("success");
                        res.redirect("/search");
                    })
                }
            })
        }
    }catch(err){
        console.log(err);
    }


});


passport.use("local",new Strategy(async function verify(username,password,cb){
    try{
        const result = await db.query("SELECT * FROM users WHERE email = $1",[username]);

        if(result.rows.length>0){
            const user = result.rows[0];
            const userPass = user.password;

            bcrypt.compare(password,userPass,(err,valid)=>{
                if(err){
                    console.log("Error in Comparing password",err);
                    return cb(err);
                }else{
                    if(valid){
                        return cb(null,user);
                    }else{
                        return cb(null,false);
                    }
                }
            });
        }else{
            return cb(null,false,{
             message:"User not found"
            });
        }
    }catch(err){
        return cb(err);
    }
})
);

passport.serializeUser((user,cb)=>{
    return cb(null,user);
});

passport.deserializeUser((user,cb)=>{
    return cb(null,user);
});

app.use((req,res)=>{
    res.status(404).render("404.ejs");
});

app.use((err,req,res,next)=>{
    console.log(err);

    return res.status(500).render("500.ejs");
})

// server

app.listen(port,()=>{
   console.log(`App running in port:${port}`);
});