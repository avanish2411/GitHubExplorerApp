import { createSlice } from '@reduxjs/toolkit';

const repositoriesSlice = createSlice({
  name: 'repositories',
  initialState: [],
  reducers: {
    setRepositories: (state, action) => action.payload,
  },
});

export const { setRepositories } = repositoriesSlice.actions;
export default repositoriesSlice.reducer;
