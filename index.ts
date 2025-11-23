//importamos la base de datos de firebase, en tsconfig configuramos para que importe
import * as admin from "firebase-admin";
import { users, products } from "./bd";
import express from "express";

 
//importamos la key que generamos, no se guarda aqui , es solo para el ejercicio.
import * as  ServiceAccount  from "./keyFirestore.json";

//con esto nos conectamos con credenciales a firestore
admin.initializeApp({
  credential: admin.credential.cert(ServiceAccount as any)
});

//traemos las funciones de firestore
const baseDeDatos = admin.firestore()
const collUsersBd = baseDeDatos.collection("usuarios")
const collProdBd = baseDeDatos.collection("productos")

//creamos una funcion para poder subir los datos

 async function subirBaseDatos(users,collection) {
  //creamos la collection
  

  console.log("iniciando subida de datos...");

for (const user of users) {
    // 1. Obtener el ID del documento
    const idusers = user.id.toString(); 
    
    // 2. Crear el objeto sin el campo ID redundante
    // Copiamos todas las propiedades del usuario
    const userData = { ...user };
    // Eliminamos el campo ID interno (opcional, pero recomendado)
    delete userData.id; 
    
    const docRef = collection.doc(idusers);
    
    // 3. Subir el documento con los datos limpios
    await docRef.set(userData);
  }
  console.log("¡Proceso de subida de datos terminado!");
 }


 subirBaseDatos(users,collUsersBd)
 subirBaseDatos(products,collProdBd)
  

 // utilizamos express para poder hacer la api y comunicarme con postman
const app = express();



  //PETICION DONDE OBTIENE TODOS LOS PRODUCTOS Y USUARIOS
app.get("/productos", async (req, res) => {
  // Convertimos el manejador de Express en asíncrono
  try {
    // La consulta se hace directamente en el cuerpo de la función
    const snapshot = await collProdBd.get(); 
    
    // Mapeo de datos
    const datos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Envío de respuesta exitosa
    res.status(200).json({ datos });
    
    // El console.log va aquí si quieres que se muestre solo al terminar
    console.log("Productos traídos con éxito."); 

  } catch (error) {
    // ⚠️ Manejo de Errores: Captura cualquier fallo de Firestore o de la lógica
    console.error("Error al traer los productos de Firestore:", error);
    
    // Envía un código de error al cliente
    res.status(500).json({ 
      mensaje: "Error interno del servidor al consultar la base de datos.",
      error: error.message 
    });
  }
});

// app.get("/users", (req, res) => {

//   const allClientes = users.map((cliente) => cliente.nombre);
//   console.log(allClientes);
  
//   res.status(200).json({allClientes});
// });




// // busca un producto en el array y lo devuelve

// app.get("/productos/:id", (req,res) => {

//   const id =  parseInt( req.params.id)
//   const productoId = products.find((lista) => lista.id === id)
//   if(!productoId) {
//     return res.status(404).json({ error: "Producto no encontrado" });
//   }
//  res.status(200).json({ nombre: productoId.nombre });
// });

// // Actualizar un producto con su id 

// app.put("/productos/:id", (req,res) =>{
//   const idUrl = parseInt(req.params.id)
//   const nuevoNombre =  stringify(req.body.nombre)
//   console.log("nuevoNombre:", nuevoNombre);


//   const idModificar = products.find((item)=>
//       item.id === idUrl)
//   console.log(idModificar)
//   if (idModificar) {
//     idModificar.nombre = nuevoNombre
//   }
//   else{
//     return res.status(404).json({error:"No se modifico el producto"})
//   }

//   res.status(200).json(idModificar.nombre)
  
// });
// //vamos a borrar un producto cuando el usuario lo pida
// app.delete("/productos/:id", (req,res)=>{

//  const id =  parseInt(req.params.id)
// const index = products.findIndex(producto => producto.id === id);
// if (index !== -1) {
//   products.splice(index, 1);
// }
// else{

//     return res.status(404).json({error:"No se borro el producto"})
// }

//   res.status(200).json(products)

  




// })
// // agrega  un producto al array 
// app.post("/productos",(req,res)=>{
//   const productoNuevo = req.body.nombre
  
//   if (!productoNuevo) {
// return res.status(400).json({ error: "El nombre del producto es requerido." });
// }
//   const nuevoId =   products[products.length-1].id + 1
//   products.push({"id":nuevoId, "nombre":productoNuevo})

//   res.status(201).json(products[products.length-1])
// }

// 
