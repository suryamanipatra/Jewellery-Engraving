import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "",
    email: "",
    role: "",
}

export const authReducer = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLoginDetails :(state,action) => {
            const {name, email, role} = action.payload.user
            state.name = name,
            state.email = email,
            state.role = role
        },
        logout : (state) => {
            state.name = ""
            state.email = ""
            state.role = ""
        }
    },
})

export const { setLoginDetails, logout } = authReducer.actions

export default authReducer.reducer