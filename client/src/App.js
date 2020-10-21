import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import { LoginContext, LOGIN_ACTIONS } from './context';

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
					dispatch({ type: LOGIN_ACTIONS.ERROR_LOGIN, payload: error.data });
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
