import { createContext, useContext, useEffect, useReducer } from "react";
import ShortkeyManager from "../classes/SkManager";
import { AccountType, useAuth } from "./AuthCtx";

import { v4 as uuid } from 'uuid';
import Settings from "../classes/Settings";

const initialState = {

    initialized: false,
    loading: false,

    localShortkeys: null, /** Offline shortkeys manager */
    accountShortkeys: null,

    offset: 0,
    limit: 20,
    currentData: [],

    queryResults: [],
    queryActive: false,

    searchOffset: 0,
    searchLimit: 20
};

const handlers = {
    SETUP: (state, action) => {
        return {
            ...state,
            ...action.payload
        }
    },
    DATA: (state, action) => {
        return {
            ...state,
            ...action.payload
        }
    }
}

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const SkContext = createContext({
    ...initialState,
    addShortkey: async (shortkey, url, tags) => {},
    searchShortkeys: async (query, next = false) => {},
    findShortkeys: async (query) => {}
});

function SkProvider({ children }) {

    const [state, dispatch] = useReducer(reducer, initialState);

    const authCtx = useAuth();

    const initLocalShortkeys = () => {
        dispatch({
            type: 'SETUP',
            payload: {
                localShortkeys: new ShortkeyManager(),
                initialized: true
            }
        });
    }

    const initialize = () => {

        if (authCtx.account_type === AccountType.GuestMode) {
            /**
             * Setup local shortkeys
             * Get location and create preferred default shortkeys
             * Load local shortkey manager
             */

            initLocalShortkeys();
        }
        else if (authCtx.account_type === AccountType.AccountMode) {
            /**
             * Fetch shortkeys
             * Fetch settings
             * Sync in local
             * initialized=TRUE
             */
        }
    }

    useEffect(() => {

        if (state.initialized) {
            getShortkeys();
        }

    }, [state.initialized]);

    useEffect(() => {

        if (!authCtx.initialized) {
            return;
        }

        console.log("init shortkeys....");
        initialize();

        return () => { }

    }, [authCtx.initialized]);

    const getShortkeys = async () => {

        /**
         * 
         * Advanced loading, show loading if it taking more than 1 second
         */

        let loadFinished = false;

        let loadingTimeout = setTimeout(() => {
            if (loadFinished) {
                clearTimeout(loadingTimeout);
            }
            else {
                dispatch({
                    type: 'DATA',
                    payload: {
                        loading: true
                    }
                })
            }
        }, 1000);

        let skData = ShortkeyManager.getShortkeys(
            state.offset,
            state.limit
        );

        loadFinished = true;

        dispatch({
            type: 'DATA',
            payload: {
                currentData: [...state.currentData, ...skData],
                offset: state.offset + skData.length,
                loading: false
            }
        });
    }

    const refreshShortkeys = async () => {

        /**
         * 
         * Advanced loading, show loading if it taking more than 1 second
         */

        let loadFinished = false;

        let loadingTimeout = setTimeout(() => {
            if (loadFinished) {
                clearTimeout(loadingTimeout);
            }
            else {
                dispatch({
                    type: 'DATA',
                    payload: {
                        loading: true
                    }
                })
            }
        }, 1000);

        let skData = ShortkeyManager.getShortkeys(
            0,
            state.offset+state.limit
        );

        loadFinished = true;

        dispatch({
            type: 'DATA',
            payload: {
                currentData: [...skData],
                offset: state.offset,
                loading: false
            }
        });
    }

    function modifyUrl(url) {
        // Regular expression to match the input URL
        const regex = /^((https?:\/\/)?(www\.)?)?(.*)$/;

        // Extract the relevant parts of the input URL
        const match = regex.exec(url);
        const www = match[3] || '';
        const domain = match[4];

        // Combine the parts to form the modified URL
        const modifiedUrl = `http://${www}${domain}`;

        return modifiedUrl;
    }

    const addShortkey = async (shortkey, url, tags) => {
        let u = modifyUrl(url);
        ShortkeyManager.addShortkey({
            id: uuid(),
            shortkey: shortkey,
            favicon: `https://f.start.me/${(new URL(u)).hostname}`,
            url: u,
            tags: tags
        });
        refreshShortkeys();
    }

    const searchShortkeys = async (query, next = false) => {
        
        if(query.length < 1)
        {
            refreshShortkeys();
            return;
        }

        let results = [];

        if(next) {

            results = ShortkeyManager.searchShortkeys(query, state.searchOffset, state.searchLimit)
            
            dispatch({
                type: 'DATA',
                payload: {
                    searchOffset: state.searchOffset + results.length,
                    currentData: [...state.currentData, ...results]
                }
            })
        }
        else
        {

            results = ShortkeyManager.searchShortkeys(query, 0, state.searchLimit)
            
            dispatch({
                type: 'DATA',
                payload: {
                    searchOffset: state.searchOffset + results.length,
                    currentData: [...results]
                }
            })
        }
    }

    const findShortkeys = async (query) => {
        if((query || "").trim().length < 1)
        {
            dispatch({
                type: 'DATA',
                payload: {
                    queryResults: [],
                    queryActive: false
                }
            });
    
            return;
        }

        let results = ShortkeyManager.findShortkeys(query);

        dispatch({
            type: 'DATA',
            payload: {
                queryResults: results,
                queryActive: true
            }
        });
    }

    return (
        <SkContext.Provider
            value={{
                ...state,
                addShortkey,
                searchShortkeys,
                findShortkeys
            }}>
            {children}
        </SkContext.Provider>
    );

}

const useSk = () => useContext(SkContext);

export default SkProvider;
export { SkContext, useSk };