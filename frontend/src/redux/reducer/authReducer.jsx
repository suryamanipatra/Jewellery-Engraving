import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "",
    email:""
}

export const authReducer = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLoginDetails :(state,action) => {
            const {name,email} = action.payload.user
            state.name = name,
            state.email = email
        },
        logout : (state) => {
            state.name = ""
            state.email = ""
        }
    },
})

export const { setLoginDetails, logout } = authReducer.actions

export default authReducer.reducer