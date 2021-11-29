import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from 'universal-cookie';

export const getFaucetList = createAsyncThunk(
  "faucets/getFaucetList",
  async (_, thunkAPI) => {
    try {
      const { data, status } = await axios.get('https://faucetworld.in/faucet-list/data.json');
      if (status === 200) {
        return data;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

const getSelectedCurrency = () => {
    const cookies = new Cookies();
    const selectedCurrency = cookies.get("selected-currency")
    if(selectedCurrency) {
        return selectedCurrency;
    } else {
        return "BNB";
    }
}

const getFavoriteSites = () => {
    const cookies = new Cookies();
    const favoriteSites = cookies.get("favorite-sites")
    if(favoriteSites) {
        return favoriteSites;
    } else {
        return [];
    }
}

export const faucetListSlice = createSlice({
  name: "faucetList",
  initialState: {
    sites: [],
    selectedCoinSites: [],
    selectedCoin: getSelectedCurrency(),
    favoriteSites: getFavoriteSites(),
    isFetching: false,
    isSuccess: false,
    isError: false,
    errorMessage: "",
  },
  reducers: {
    clearState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isFetching = false;

      return state;
    },

    updateSelectedCoinSites: (state, {payload}) => {
        const cookies = new Cookies();
        cookies.set("selected-currency", payload);
        state.selectedCoin = payload;
        state.selectedCoinSites = state.sites.filter(site=>{
            return site.currency === payload;
        });
        return state;
    },

    updateFavoriteSites: (state, {payload}) => {
        const cookies = new Cookies();
        if(payload.value) {
            state.favoriteSites = [...state.favoriteSites, payload.element];
        } else {
            state.favoriteSites = state.favoriteSites.filter(site => {
                return site !== payload.element;
            })
        }
        cookies.set("favorite-sites", state.favoriteSites);
        return state;
    },
  },
  extraReducers: {
    [getFaucetList.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.sites = payload.sites;
      state.selectedCoinSites = payload.sites.filter(site => {
        return site.currency === state.selectedCoin;
      })
    },
    [getFaucetList.pending]: (state) => {
      state.isFetching = true;
    },
    [getFaucetList.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
    },
  },
});


export const { clearState, updateSelectedCoinSites, updateFavoriteSites } = faucetListSlice.actions;

export default faucetListSlice.reducer