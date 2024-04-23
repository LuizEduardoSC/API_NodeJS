import express from "express"
import pkg from "pg"

const app = express();

app.use(express.json());

const {Pool} = pkg;

const pool= new Pool({
    user: "postgres",
    host: "localhost",
    database: "novaempresa",
    password: "root",
    port:5432
})

const clientes = [
    { "id": 1, "nome": "Eduardo", "idade": "18" },
    { "id": 2, "nome": "Vitoria", "idade": "22" }];

app.get("/clientes",async (request, response) => {
    const {rows} = await pool.query("SELECT * FROM cliente")
    return response.status(200).json(rows);
})

app.post("/cliente", async(request, response) => {
    const { nome, cpf } = request.body;
    const cliente = await pool.query("INSERT INTO cliente (nome, cpf) VALUES ($1, $2)", [nome, cpf])
    return response.status(201).json({ "nome": nome, "cpf": cpf });
})

app.put("/cliente/:id", async (request, response) => {
    const { id } = request.params;
    const { nome, cpf } = request.body;
    const cliente = await pool.query("UPDATE cliente SET nome = $1, cpf = $2 WHERE id = $3 ",[ nome, cpf, id ])

    return response.status(200).json({ "nome": nome, "cpf": cpf });
})


app.delete("/cliente/:id", async (request, response) => {
    const {id} = request.params;
    const cliente = await pool.query("DELETE from cliente WHERE id = $1", [id])
    return response.status(204).send();
    })



app.listen(3000, () => {
    console.log("Running Server");
})