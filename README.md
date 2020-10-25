# Autenticación con React + Nodejs, usando el flujo manual de la API Login de Facebook. (En español)

###### Este Tutorial es recomendado para programadores avanzados

 > Este tutorial se realiza debido a que muchas veces queremos implementar un login diferente al típico modelo usuario o correo electrónico y contraseña, esto nos permite darle más alternativas al usuario y hacer más cómoda su experiencia ya que no tiene que administrar varias cuentas y solo la del servicio que utilicemos en este caso Facebook.


 Usaremos React y su API Context para controlar el estado de nuestra aplicación, además utilizaremos Nodejs + Express para configurar nuestro servidor, controlar nuestras peticiones y mantener la mayor seguridad posible (ya lo veremos durante el tutorial).


## Empecemos creando 2 carpetas una carpeta cliente y la otra con el nombre servidor.

Ahora tenemos que abrir nuestra terminal, Puedes ejecutar **Shift + Click Derecho** dentro de la carpeta y seleccionar la opción **Abrir terminal aquí** (Este nombre puede variar).


**TIP** : Utiliza el comando en la terminal `cd` para navegar entre las carpetas, pues hacer `cd ..` para salir de la carpeta o `cd CARPETA` para acceder a la carpeta.


Configuraremos nuestro servidor con Nodejs para poder consumirlo con nuestro cliente hecho en React.

Ahora usamos nuestra terminal para acceder a la carpeta servidor e inicializaremos nuestro **package.json**  usando el siguiente comando:

`
npm init --yes
`


Utilizaremos estos paquetes:

**express**: Nuestro framework para poder usar nodejs de una manera más rápida al codificar nuestras rutas e inicializar nuestro servidor.

**axios**: Lo usaremos para ejecutar nuestras peticiones al servidor, también puedes utilizar por defecto la API Fetch de Javascript.

**cors**: Nos permite conectarnos con objetos externos al servidor.

**dotenv**: Mantendrá nuestras credenciales seguras en nuestro servidor, aunque en este ejemplo lo pondremos.

**Recuerda nunca colocar tus credenciales en tus repositorios o en algún otro que no sea el propio servidor.**

Se explicara con más detalle cuando configuremos tales variables, estás serán nuestras credenciales para usar la API de Facebook y camuflar la información del usuario.

**jsonwebtoken**: Usaremos json web tokens para mandar nuestra información desde el servidor de manera segura utilizando un algoritmo para verificar si debemos mandar la información requerida (En la práctica es más sencillo de entender).



Las dependencias de desarrollo o como aparecerá en nuestro **package.json** **"devDependencies"** se utilizan para facilitar nuestro desarrollo pero no interfieren en la funcionalidad del proyecto.

En nuestro caso lo utilizaremos 2 :

**morgan**: Funciona para visualizar las peticiones por consola que llegan a nuestro servidor y nos dan ciertos detalles que nos pueden ayudar.

**nodemon**: Este paquete funciona para que cuando hagamos algún cambio en nuestro código automáticamente se reinicie nuestro servidor con los cambios aplicados.


## Lo primero que necesitamos hacer  es instalar nuestras dependencias y configurar nuestro servidor con nodemon para que se reinicie cada vez que hagamos un cambio.


Ejecutamos:

`
npm i express axios cors dotenv jsonwebtoken
`
`
npm i --save-dev morgan nodemon
`
o
`
npm i -D morgan nodemon
`

 > Si tienes algún error al momento de instalar algo o al usar un comando y no sabes a que se deba, investiga y ve resolviéndolos poco a poco. Recuerda que pueden fallar muchas cosas, en ocasiones tu conexión puede fallar, o te falto instalar algo, o simplemente erraste al escribir un comando, recuerda siempre solucionar los errores que puedas eso te dará mucha experiencia, y lo más importante no te rindas hasta que lo hayas dado todo, siempre puedes preguntarle a alguien o en sitios como stackoverflow, etc : ).


**Ahora vamos a nuestro package.json ubicado en la carpeta servidor con nuestro editor de código preferido**


Borramos todo en la sección de scripts y lo reemplazamos con nuestros comandos:

```javascript
"scripts": {
	"start": "node src/index.js",
	"server": "nodemon src/index.js"
	},
```

Bien ya tenemos todo listo para trabajar en el servidor además haremos una ruta para ver que todo funcione correctamente:

> Pondremos los segmentos del código y lo explicaremos paso a paso para que te guíes.

```javascript
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const axios = require("axios");
const jwt = require("jsonwebtoken");

```

En esta parte del código traemos lo que necesitemos de nuestras dependencias para utilizarlas en nuestro servidor:

**express**: Usado para correr nuestro servidor a través de la constante app.

**morgan**: Será utilizado para ver las peticiones, morgan es un midlleware esto significa que se ejecutara antes de cualquier petición y dará paso a ella.

**cors** : Nos permite intercambiar datos con servidores y clientes externos.

**axios**: Ejecutara nuestras peticiones desde el cliente y el servidor.

**jwt** : Nos brindara unas funciones camuflar y entregar la información al usuario.



Configuramos el puerto del servidor, las credenciales y los middlewares:

```javascript
const PORT = 4000;
require("dotenv").config(); 

app.use(morgan("dev")); //Request Middleware
app.use(express.json()); // Send and Receive Json
app.use(cors()); //Cross Origin Receive and Send Data

```


Realizamos una funcion nos permitira probar nuestro servidor:

```javascript
app.get('/', (req, res) => {
	res.send('Hello World with Nodejs and Express');
});
```

Aquí le decimos a nodejs que en la ruta por defecto ( **/** ), nos devuelva nuestro texto de prueba a través de una petición get.

Utilizaremos una función asíncrona para inicializar nuestro servidor y muestre el mensaje por consola si funciona correctamente, en el caso de fallar mostrara un error por consola.

```javascript
async function main() {

	await app.listen(PORT);
	console.log('Server on PORT ${PORT}');

}

main();
```

Bien ejecutemos ahora ejecutemos el comando que configuramos:


`
npm run server
`

Se ejecutara nodemon y luego se vera nuestro mensaje **Server on PORT 4000** iremos a nuestro navegador e introducimos la dirección que utilizamos para desarrollar:


http://localhost:4000


Recuerda que el **4000** es el puerto, puede varias si cambiaste la variable **PORT**, al entrar a esta ruta (**/**) tendríamos que ver nuestro mensaje de prueba


**Hello World with Nodejs and Express**



## Tenemos nuestro servidor listo para empezar a trabajar en nuestro servicio de autenticación, haremos 3 rutas en nuestro servidor.


la ruta **http://localhost:4000/login/facebook** con una petición **GET**, la cual nos mandara a la plataforma de Facebook para colocar nuestro usuario, contraseña y dar los permisos para nuestro servidor.

la ruta **http://localhost:4000/login/facebook/authorize** con una petición **GET**, que servirá para que facebook nos redireccione cuando iniciemos sesion , aquí se verificaran los datos y se pedirá la información del usuario que usaremos en nuestro servidor.

la ruta **http://localhost:4000/user con una petición** con una petición **POST**, aquí enviaremos nuestro token creado a través de nuestro servidor en la ruta **facebook/auhorize** y si es correcto nos devolverá la información que necesitemos.





**Antes de seguir trabajando en nuestro login debemos registrar nuestra aplicación en la plataforma de facebook developers para obtener los datos que usaremos para que a través de una petición podamos obtener los datos del usuario una vez nos habilite su permiso**


Entramos a https://developers-facebook.com

Tendremos que crear y confirmar nuestra cuenta con nuestro correo electrónico

Luego de esto vamos a la sección "Mis aplicaciones" o "My Apps"

Damos click en "Create App" o "Crear Aplicacion"

Seleccionamos la opción "Todo lo demás" o "For everything else"

Le ponemos un nombre email de contacto (nuestro email por defecto)

Damos click en crear identificador (ID) de la aplicación

Iremos a la sección "Productos" o "Products"

Buscamos Facebook Login y damos click en Set up


**Opcional**
Podemos dar click en Other ya que nuestro login tendra un flujo manual

Y luego seleccionamos manually build a login flow o manejar manualmente un flujo de login

Aquí podremos ver datos y el flujo seguiremos para autenticarnos, puedes leerlo antes de continuar para tener una idea


dejaremos todo como esta y guardamos los cambios

**RECUERDA** : Utilizaremos cuentas de testeo que nos provee Facebook en la pestaña Roles - Test Users, debido a que nuestra app esta en desarrollo.




Luego de que tengamos todo configurado tendremos que utilizar nuestras credenciales en el servidor para eso utilizaremos la dependencia dotenv la cual nos ayuda a mantener variables en las que estarán las credenciales sin incluirlas en el código.


Ahora iremos a nuestras configuraciones o settings, damos click a la pestaña basic

Copiaremos nuestro **App ID** y nuestro **App Secret** para incluirlo en nuestro archivo **.env**

lo pegamos donde va cada uno.

Crearemos un archivo llamado **.env** en el directorio principal del servidor en el configuraremos las siguientes variables:

```
SECRET_KEY=SECRET_RANDOM_STRING

CLIENT_ID_FACEBOOK=XXXXXXXXXXXXXXXXXXX

CLIENT_SECRET_FACEBOOK=XXXXXXXXXXXXXXXXXX

REDIRECT_URI_FACEBOOK=http://localhost:4000/facebook/authorize
```


**SECRET_KEY**:La primera variable es la llave que usaremos para camuflar nuestra información a través de un token.

Los siguientes variables junto a su respectivo valor son dados y configurados a través de Facebook para realizar nuestro proceso de login.

**Redirect URI**: Es el lugar al que nos mandara Facebook una vez iniciemos sesión.


##Procederemos a realizar la autentificación usando nuestras rutas en el servidor

Primero en la ruta http://localhost:4000/login/facebook/authorize serviremos el link de redirección para que el usuario se identifique con un cliente a través de nuestro servidor.


```javascript
app.get('/facebook', (req, res) => {

	const URL = res.redirect(
		'https://www.facebook.com/v6.0/dialog/oauth?' +
		'client_id=${process.env.CLIENT_ID_FACEBOOK}' +
		'&redirect_uri=${process.env.REDIRECT_URI_FACEBOOK}' +
		'&response_type=code&scope=email'
);
});
```

**process.env.VARIABLE**: Es la sintaxis que utilizamos para llamar a nuestras credenciales desde el archivo .env.

**CLIENT_ID**: Rl cual es un código que permite a Facebook identificar nuestra aplicación.

**REDIRECT_URI**: Representa la ruta de nuestro servidor al que será enviado el token de autorización luego del inicio de sesión del usuario, ya lo configuramos anteriormente.

Podemos probarlo e iniciar sesión aunque no hará más que redirigirnos a una ruta aun no creada de nuestro servidor.


Crearemos ahora la ruta a la que nos mandara Facebook luego de que el usuario inicie sesión.

```javascript
app.get('/facebook/authorize', async (req, res) => {
	try {
		const URL =
			`https://graph.facebook.com/v6.0/oauth/access_token?` +
			`client_id=${process.env.CLIENT_ID_FACEBOOK}` +
			`&redirect_uri=${process.env.REDIRECT_URI_FACEBOOK}` +
			`&client_secret=${process.env.CLIENT_SECRET_FACEBOOK}` +
			`&code=${req.query.code}`;

		const tokenResponse = await axios.get(URL); //Get Token
		const { access_token } = tokenResponse.data;

		const DATA_URL =
			`https://graph.facebook.com/me?` +
			`access_token=${access_token}&fields=email,first_name,name,picture`;

		const dataResponse = await axios.get(DATA_URL);

		const { email, first_name, name } = dataResponse.data;
		const avatar = dataResponse.data.picture.data.url;

		const user = {
			avatar,
			first_name,
			name,
			email,
		};

		jwt.sign(
			{ user },
			process.env.SECRET_KEY,
			{ expiresIn: '20s' },
			(err, token) => {
				res.redirect(`http://localhost:3000/?token=${token}`);
			}
		);
	} catch (error) {
		console.log(error);
		res.redirect('http://localhost:3000/?error=failed-query');
	}
});
```

Bien hay mucho código allí lo iremos viendo paso a paso , a primera vista vemos que nuestra ruta ejecuta una función asíncrona esto lo usamos por que vamos a hacer las peticiones para obtener un token de acceso y consultar los datos del usuario a través de este.

**URL**: Es el url en formato string pero adjuntando nuestras credenciales.

El parámetro final de esta variable es muy importante (**code**) este código nos lo envia Facebook en el url al que somos redireccionados una vez iniciemos sesión y este es estrictamente necesario para hacer nuestras peticiones.

La constante **tokenResponse** almacena la respuesta de nuestro token de acceso al hacer la petición con nuestras credenciales, es este token el que utilizaremos para consultar la API de Facebook y obtener los datos de nuestro usuario.

En **access_token** guardaremos el token resultante de la peticion que hicimos anteriormente.

**DATA_URL**: Es la url que Facebook tiene para intercambiar nuestro token de acceso, allí mandamos los campos que necesitemos y si tenemos permiso a ellos nos devolverá tal información.

Luego de realizar la petición correctamente a través de axios recibiremos nuestra información , la destructuramos y la guardaremos temporalmente en un objeto llamado user.



**ATENCION**: En este segmento del código utilizaremos nuestras funciones de jsonwebtoken para camuflar nuestra información y retornar un token al cliente.


**jwt.sign()** : Puede admitir varios parámetros pero aquí utilizaremos 4, el objeto con la información del usuario, la credencia **secret_key** la cual se utiliza para esconder nuestra información, el parámetro **expiresIn** el cual nos permite que el token solo sea valido durante 20s luego de transcurrido este tiempo el token dejara de funcionar, y una función que nos redireccionará hacia nuestro cliente con el token si todo funciona correctamente.




**Ademas añadiremos una función que verifique si el formato de nuestro token es valido:**


```javascript
const verifyToken = (req, res, next) => {
	const bearerHeader = req.headers['authorization'];
	//Check if bearer is undefined
	if (typeof bearerHeader !== 'undefined') {
		//Split at the space
		const bearer = bearerHeader.split(' ');
		//Get token from array
		const bearerToken = bearer[1];
		//Set Token
		req.token = bearerToken;
		next();
	} else {
		//Forbidden
		res.sendStatus(403);
	}
};
```


Bien ya tenemos nuestro token para acceder a la información del usuario, antes de empezar con el cliente haremos una ruta para que el servidor nos devuelva la información del usuario con nuestro token.

```javascript

app.post('/user', verifyToken, (req, res) => {

	jw.verify(req.token, process.env.SECRET_KEY, (err, authData) => {

			if (err) {
				res.redirect('http://localhost:3000/?error=failed-query');
			} else {
				res.json(authData);
			}
	});
});
```

En esta sección del codigo utilizamos la función **jwt.verify()** con el token que envia el cliente, el **SECRET_KEY** que esta en nuestras variables de entorno, y una función que nos retorna la información del usuario si todo funciona correctamente o nos redirige a una ruta del cliente en el caso de que falle.


Ahora realizaremos la lógica del cliente empezaremos creando nuestro proyecto con **create-react-app**.

Es un comando que nos permite configurar una aplicacion por defecto de React para evitarnos el tenerque configurar, es decir nos configura todo, borraremos la mayoría de archivos en nuestro ejemplo:

Vamos a nuestra terminal y navegamos a la carpeta client cuando estemos ubicados allí ejecutamos el comando:

`
npx create-react-app .
`

el punto representar nuestra ruta actual.

Tambien ejecutaremos el comando para instalar axios , el paquete que se encargara de las peticiones.

`
npm  i  axios 
`

Borraremos todos los archivos dentro de la carpeta src a execpción **App.js** y **index.js**

Tambien tendremos que quitar del código, al final solo nos quedaran los archivos con el siguiente codigo:

En App.js
```javascript
import React from 'react';

function App() {
	return <h1>Hello World</h1>;
}

export default App;
```

En index.js
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('root')
);
```

Podemos probar lo que hicimos con **npm start**, nos mostrara el **Hello World** incluido en nuestro archivo **App.js**


## Ahora llego el momento de implementar el estado de login de nuestra aplicación usaremos la **API Context** para esto:

Empezamos configurando el Proveedor o (Provider), creamos un nuevo archivo llamado **context.js** para incluir nuestro contexto o estado y las funciones o también llamadas acciones que lo cambiaran respectivamente.

```javascript
import React, { useReducer, createContext } from 'react';

const initialState = {
	userData: { avatar: '', name: '', email: '' },
	isLoggedIn: false,
	error: null,
};

const LOGIN_ACTIONS = {
	PENDING_LOGIN: 'pending_login',
	SUCESS_LOGIN: 'sucess_login',
	ERROR_LOGIN: 'error_login',
};

const defaultReducer = (state, action) => {
	switch (action.type) {
		case LOGIN_ACTIONS.PENDING_LOGIN:
			return {
				...state,
			};
		case LOGIN_ACTIONS.SUCESS_LOGIN: {
			return {
				...state,
				userData: action.payload,
				isLoggedIn: true,
			};
		}
		case LOGIN_ACTIONS.ERROR_LOGIN: {
			return {
				...state,
				error: action.payload,
			};
		}
		default:
			return state;
	}
};

const LoginContext = createContext(initialState);

const LoginProvider = ({ children }) => {
	const [state, dispatch] = useReducer(defaultReducer, initialState);

	return (
		<LoginContext.Provider value={{ state, dispatch }}>
			{children}
		</LoginContext.Provider>
	);
};

export { LoginContext, LoginProvider, LOGIN_ACTIONS };
```

En la variable **initialState** esta el estado inicial de nuestra aplicación esto lo cambiaremos realizando las peticiones a nuestro servidor y obteniendo sus respectivos datos.

Además tendremos que importar nuestro proveedor a nuestro archivo raiz en este caso es **index.js**.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { LoginProvider } from './context';

ReactDOM.render(
	<React.StrictMode>
		<LoginProvider>
			<App />
		</LoginProvider>
	</React.StrictMode>,
	document.getElementById('root')
);
```

Luego obtenemos nuestro estado desde nuestro archivo **context.js** a **App.js** usando el hook useContext:

```javascript
import React, { useContext } from 'react';
import { LoginContext } from './context';

function App() {
	const { state, dispatch } = useContext(LoginContext);

	return <h1>{state.isLoggedIn}</h1>;
}

export default App;
```

Ya tenemos nuestro estado listo para empezar a cambiarlo, primero realizaremos un renderizado condicional para que nos muestre un botón con la opción de iniciar sesión o la información del usuario.

```javascript
import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import { LoginContext, LOGIN_ACTIONS }  from './context';

function App() {
	const { state, dispatch } = useContext(LoginContext);

	const urlParams = new URLSearchParams(window.location.search);

	return (
		<>
			{state.isLoggedIn ? (
				<>
					<h1>Iniciaste sesion correctamente</h1>
					<img src={state.userData.avatar} alt="Profile" />
					<h2>Nombre: {state.userData.name} </h2>
					<h3>Email: {state.userData.email} </h3>
				</>
			) : (
				<>
					<h1>No has iniciado sesion</h1>
					<a href="http://localhost:4000/facebook">
						Iniciar Sesion con Facebook
					</a>
				</>
			)}
		</>
	);
}

export default App;
```


React verifica el estado que tiene la variable **state.isLoggedIn** y renderiza dependiendo del valor , esto lo cambiaremos a través de las rutas de nuestro servidor y lo que este nos devuelve.

Adelantando un poco añadimos la librería axios para realizar la petición además de las acciones junto a nuestro context.

Declararemos la variable **urlParams** que nos servirá para obtener los parámetros de nuestra url actual, esto es para que cuando nuestro servidor nos redirigirá hacia el cliente este lo detecte y realice la petición usando el token recibido.


```javascript
import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import { LoginContext, LOGIN_ACTIONS }  from './context';

function App() {
	const { state, dispatch } = useContext(LoginContext);

	const urlParams = new URLSearchParams(window.location.search);

	useEffect(() => {
		if (urlParams.has('token')) {
			const token = urlParams.get('token');

			const getData = async () => {
				try {
				const response = await axios.post(
					'http://localhost:4000/user',
					{},
					{
					headers: { Authorization: `Bearer ${token}` },
					}
				);

					console.log(response.data);

					dispatch({
						type: LOGIN_ACTIONS.SUCESS_LOGIN,
						payload: response.data.user,
					});
				} catch (error) {
					console.log(error);
					dispatch(
						{ type: LOGIN_ACTIONS.ERROR_LOGIN, payload: error.data }
					);
				}
			};

			getData();
		}
	}, []);

	return (
		<>
			{state.isLoggedIn ? (
				<>
					<h1>Iniciaste sesion correctamente</h1>
					<img src={state.userData.avatar} alt="Profile" />
					<h2>Nombre: {state.userData.name} </h2>
					<h3>Email: {state.userData.email} </h3>
				</>
			) : (
				<>
					<h1>No has iniciado sesion</h1>
					<a href="http://localhost:4000/facebook">
						Iniciar Sesion con Facebook
					</a>
				</>
			)}
		</>
	);
}

export default App;
```


Utilizamos el hook **useEffect** para que cuando se renderice nuestro componente ejecute la función asíncrona que hicimos para realizar nuestra petición, solo si existe un token(en el caso del que el token no sea valido el servidor mandara un error por consola).

En nuestra petición mandamos el token que recibimos del servidor a través de **axios** , junto con sus respectivos **headers**.

Si en algún momento la petición falla , se ejecuta la acción del error y actualizara el estado guardando el error además de mostrarlo por consola.

Luego de realizar nuestra petición correctamente mandamos nuestro datos con la acción y esto actualizara nuestro estado mostrándonos los datos del usuario en pantalla.



**RETO**: Te dejamos como reto crear las rutas y botones faltanes para la revocacion de permisos y logout del usuario, lee la documentacion de facebook te ayudara mucho.


**Este es el fin del tutorial puede ser un poco confuso pero recuerda que existen otras formas de implementar esta misma funcionalidad cada una con sus pros y contras, esperamos que por lo menos hayas aprendido algo nuevo.**

## Hasta la proxima



