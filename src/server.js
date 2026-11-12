import express from 'express'

const app=express();
const PORT=process.env.PORT ?? 3000;
app.use(express.json());
app.use((req,res,next)=>{
    const hora= new Date().toISOString();
    console.log(`${hora} ${req.method} ${req.url}`);
    next();
});

const fotos =[
    {id:1,titulo:'foto1',calificacion:4.5},
    {id:2,titulo:'foto2',calificacion:3}

];
app.get('/api/fotos',(req,res)=> {
    res.json(fotos);
});

app.get('/api/fotos/:id', (req, res) => {
    const id = Number(req.params.id);
    const foto = fotos.find((foto) => foto.id === id);

    if (!foto) {
        return res.status(404).json({ mensaje: `Foto ${id} no encontrada` });
    }

    res.json(foto);
});

app.post('/api/fotos', (req, res) => {
    const { titulo, descripcion, calificacion } = req.body;

    if (!titulo) {
        return res.status(400).json({ mensaje: 'El titulo es obligatorio' });
    }

    const nueva = {
        id: Math.max(0, ...fotos.map((foto) => foto.id)) + 1,
        titulo,
        descripcion,
        calificacion
    };

    fotos.push(nueva);
    res.status(201).json(nueva);
});

app.patch('/api/fotos/:id', (req, res) => {
    const id = Number(req.params.id);
    const foto = fotos.find((foto) => foto.id === id);

    if (!foto) {
        return res.status(404).json({ mensaje: 'Foto ${id} no encontrada' });
    }

    const { titulo, descripcion, calificacion } = req.body;

    if (titulo !== undefined && !titulo) {
        return res.status(400).json({ mensaje: 'El titulo no puede estar vacio' });
    }

    if (titulo !== undefined) foto.titulo = titulo;
    if (descripcion !== undefined) foto.descripcion = descripcion;
    if (calificacion !== undefined) foto.calificacion = calificacion;

    res.json(foto);
});

app.delete('/api/fotos/:id', (req, res) => {
    const id = Number(req.params.id);
    const indice = fotos.findIndex((foto) => foto.id === id);

    if (indice === -1) {
        return res.status(404).json({ mensaje: 'Foto ${id} no encontrada' });
    }

    fotos.splice(indice, 1);
    res.status(204).end();
});

app.get('api/error', async ()=> {
    throw new Error('Algo salio SAHUR')
})

app.use((err,req,res,next)=>{
    console.error(err.message);
    res
        .status(500)
        .json({mensaje:'Error peruano'})
})

app.listen(PORT,() => {
    console.log(`Servidor en http://localhost:${PORT}`)
})