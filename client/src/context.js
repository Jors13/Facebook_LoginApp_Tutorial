import React, { useReducer, createContext } from 'react';

const initialState = {
	userData: { avatar: '', name: '', email: '' },
	isLoggedIn: false,
	error: null,
	token: null,
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
