import { configureStore } from '@reduxjs/toolkit';
import applicationReducer from '../features/applicationSlice'
export const store = configureStore({
 reducer:{
    applications:applicationReducer,
   
}

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;