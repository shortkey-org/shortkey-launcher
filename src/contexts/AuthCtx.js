import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { useCookies } from 'react-cookie';
import Settings from "../classes/Settings";
import ShortkeyManager from "../classes/SkManager";
import { CookiesArray, CookiesList, LocalStorageKeys } from "../constants/cookies";
import { BackgroundImagesAvailable } from "../sidebar/settings";
import { useUI, DialogTabList } from "./UICtx";

export const AccountType = {
    GuestMode: 0,
    AccountMode: 1
}

const defaultSettings = {
    instantLauncher: false,
    addNewShortkeyButton: true,
    suggestions: true,
    hideProductHunt: false,
    hideIcons: false,
    minimalistic: false,
    enableBackgroundPicture: false,
    backgroundPicture: BackgroundImagesAvailable[0]
}

export const SettingKey = {
    instantLauncher: "instantLauncher",
    addNewShortkeyButton: "addNewShortkeyButton",
    suggestions: "suggestions",
    hideProductHunt: "hideProductHunt",
    hideIcons: "hideIcons",
    minimalistic: "minimalistic",
    enableBackgroundPicture: "enableBackgroundPicture",
    backgroundPicture: "backgroundPicture"
}

const initialState = {
    authenciated: false,
    initialized: false,
    cookies: {
        essential: true,
        other: true,
        analytical: false
    },
    account: null,
    account_type: -1,
    setting: {
        instantLauncher: null,
        addNewShortkeyButton: null,
        suggestions: null,
        hideProductHunt: null,
        hideIcons: null,
        minimalistic: null,
        enableBackgroundPicture: null,
        backgroundPicture: null
    }
}

const handlers = {
    INITIALIZE: (state, action) => {
        return {
            ...state,
            ...action.payload,
            initialized: true
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

const AuthContext = createContext({
    ...initialState,
    activateGuestMode: () => {},
    setCookiesAllowed: (data) => {},
    changeSetting: (key, val) => {},
    setAccessToken: (ac_tk) => {},
    resetGuestMode: () => {}
});

function getExpirationTime() {
    // 4 MONTHS
    var mo4 = new Date();
    var today = new Date;
    mo4.setDate(today.getDate() + 30 * 4);
    return mo4;
}

function AuthProvider({ children }) {

    const uiCtx = useUI();

    const [state, dispatch] = useReducer(reducer, initialState);
    const [cookies, setCookie, removeCookie] = useCookies(CookiesArray);

    const [cookiesToDeploy, setCookiesToDeploy] = useState({
        essential: true,
        other: true,
        analytical: false
    })

    useEffect(() => {
        dispatch({
            type: "DATA",
            payload: {
                cookies: cookiesToDeploy
            }
        })
    }, [cookiesToDeploy]);

    const getAccessToken = () => {
        return cookies[CookiesList.AccessToken];
    }

    const setAccessToken = (acTk) => {
        setCookie(CookiesList.AccessToken, acTk, {
            expires: getExpirationTime()
        });
    }

    const handleCookies = () => {

        console.log("available cookies: ", cookies);

        if(!cookies[CookiesList.LocalFeatureUsageAlert])
        {
            uiCtx.setAny({
                dialog_visible: true,
                dialog_active_tab: DialogTabList.Start
            });
        }
    }

    const loadLocalSetting = () => {
        return {
            instantLauncher: Settings.getInstantLauncher(),
            addNewShortkeyButton: Settings.getAddNewShortkey(),
            suggestions: Settings.getSuggestions(),
            hideProductHunt: Settings.getHideProductHunt(),
            hideIcons: Settings.getHideIcons(),
            minimalistic: Settings.getMinimalistic(),
            enableBackgroundPicture: Settings.getEnableBackgroundPicture(),
            backgroundPicture: Settings.getBackgroundPicture()
        }
    }

    const initDefaultLocalSetting = () => {
        Settings.initInstantLauncher(defaultSettings.instantLauncher);
        Settings.initAddNewShortkey(defaultSettings.addNewShortkeyButton);
        Settings.initSuggestions(defaultSettings.suggestions);
        Settings.initHideProductHunt(defaultSettings.hideProductHunt);
        Settings.initHideIcons(defaultSettings.hideIcons);
        Settings.initMinimalistic(defaultSettings.minimalistic);
        Settings.initEnableBackgroundPicture(defaultSettings.enableBackgroundPicture);
        Settings.initBackgroundPicture(defaultSettings.backgroundPicture);
    }

    const removeLocalShortkeys = () => {
        ShortkeyManager.removeSelf();
    }

    const removeLocalSetting = () => {
        Settings.removeSelf();
    }

    const changeSetting = (key, val) => {
        switch (key) {
            case SettingKey.instantLauncher:
                Settings.setInstantLauncher(val);
                break;
            
            case SettingKey.addNewShortkeyButton:
                Settings.setAddNewShortkey(val);
                break;
            
            case SettingKey.suggestions:
                Settings.setSuggestions(val);
                break;
            
            case SettingKey.hideProductHunt:
                Settings.setHideProductHunt(val);
                break;
            
            case SettingKey.hideIcons:
                Settings.setHideIcons(val);
                break;
            
            case SettingKey.minimalistic:
                Settings.setMinimalistic(val);
                break;

            case SettingKey.enableBackgroundPicture:
                Settings.setEnableBackgroundPicture(val);
                break;
            
            case SettingKey.backgroundPicture:
                Settings.setBackgroundPicture(val);
                break;
        
            default:
                break;
        }

        let settings = loadLocalSetting();
        dispatch({
            type: 'DATA',
            payload: {
                setting: settings
            }
        });
    }

    const handleAccount = () => {
        if(localStorage.getItem(CookiesList.AccessTokenLocal))
        {
            /** Guest mode */
            activateGuestMode();
        }
    }

    const deployOtherCookies = () => {
        setCookie(CookiesList.OtherCookies, 1, {
            expires: getExpirationTime()
        });
    }

    const deployAnalyticalCookies = () => {
        setCookie(CookiesList.AnalyticalCookies, 1, {
            expires:getExpirationTime()
        });
    }

    const deployCookies = () => {
        if(cookiesToDeploy['other'])
        {
            deployOtherCookies();
        }
        if(cookiesToDeploy['analytical'])
        {
            deployAnalyticalCookies();
        }
    }

    const setCookiesAllowed = (data) => {
        setCookiesToDeploy({
            ...cookiesToDeploy,
            ...data
        });
    }

    const setAny = (data) => {
        dispatch({
            type: 'DATA',
            payload: {
                ...data
            }
        });
    }

    const dispatchInitializationComplete = (data = {
        account: null,
        account_type: null
    }) => {
        dispatch({
            type: 'INITIALIZE',
            payload: {
                ...data
            }
        });
    }

    const activateGuestMode = () => {
        localStorage.setItem(CookiesList.AccessTokenLocal, "1");
        deployCookies();
        setCookie(CookiesList.LocalFeatureUsageAlert, 1, {
            expires: getExpirationTime()
        });
        initDefaultLocalSetting();
        let settings = loadLocalSetting();
        dispatchInitializationComplete({
            account: null,
            account_type: AccountType.GuestMode,
            setting: settings
        });
    }

    const resetGuestMode = () => {
        localStorage.removeItem(CookiesList.AccessTokenLocal);
        removeCookie(CookiesList.LocalFeatureUsageAlert);
        removeLocalSetting();
        removeLocalShortkeys();
        window.location.reload();
    }

    useEffect(() => {

        console.log("initializing authctx");

        handleCookies();
        handleAccount();

        return () => { };

    }, []);

    return (
        <AuthContext.Provider
            value={{
                ...state,
                activateGuestMode,
                setCookiesAllowed,
                changeSetting,
                setAccessToken,
                resetGuestMode
            }}>
            {children}
        </AuthContext.Provider>
    )

}

const useAuth = () => useContext(AuthContext);

export {
    AuthContext,
    AuthProvider,
    useAuth
};