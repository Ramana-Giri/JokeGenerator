import express from "express";
import axios from "axios";
import bodyParser from "body-parser";


const app = express();
const port = process.env.X_ZOHO_CATALYST_LISTEN_PORT || 3001;
const API_URL = "https://v2.jokeapi.dev/joke/Any";

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"))


app.get("/", async (req, res) => {
    try {
        const result = await axios.get(API_URL);
        res.render("index.ejs", {
            data: result.data
        });
    } catch (error) {
        console.error("Error fetching joke:", error);
        res.status(500).send("Error fetching joke");
    }
});


app.post("/get-joke", async(req, res) => {
    let { category, blacklist, type} = req.body;
    let new_url = `https://v2.jokeapi.dev/joke/${category || 'Any'}`
    if(blacklist){
        new_url += `?blacklistFlags=${blacklist.join(",")}`
    }
    if( type && type!=='Both'){
        new_url += blacklist ? `&type=${type}` : `?type=${type}`;
    }
    console.log(new_url);
    try {
        const result = await axios.get(new_url);
        res.render("index.ejs", {
            data: result.data
        });
    } catch (error) {
        console.error("Error fetching joke:", error);
        res.status(500).send("Error fetching joke");
    }
});

app.listen(port , () =>{
    console.log(`The server is running at port ${port}`)
})