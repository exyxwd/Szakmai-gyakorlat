import { combineReducers, configureStore } from '@reduxjs/toolkit';

export interface FormState {
	name: string;
	email: string;
}

const initialFormState: FormState = {
	name: '',
	email: ''
};

enum FormActionTypes {
	SET_NAME = 'SET_NAME',
	SET_EMAIL = 'SET_EMAIL'
}

interface SetNameAction {
	type: FormActionTypes.SET_NAME;
	payload: string;
}

interface SetEmailAction {
	type: FormActionTypes.SET_EMAIL;
	payload: string;
}

export const setName = (name: string): SetNameAction => ({
	type: FormActionTypes.SET_NAME,
	payload: name
});

export const setEmail = (email: string): SetEmailAction => ({
	type: FormActionTypes.SET_EMAIL,
	payload: email
});

type FormAction = SetNameAction | SetEmailAction;

const formReducer = (state: FormState = initialFormState, action: FormAction): FormState => {
	switch (action.type) {
		case FormActionTypes.SET_NAME:
			return {
				...state,
				name: action.payload
			};
		case FormActionTypes.SET_EMAIL:
			return {
				...state,
				email: action.payload
			};
		default:
			return state;
	}
};

const rootReducer = combineReducers({
	form: formReducer
});

export const store = configureStore({
	reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;