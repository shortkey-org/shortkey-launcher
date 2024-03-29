import CheckboxControl from "../components/checkbox";
import { SettingKey, useAuth } from "../contexts/AuthCtx";
import { getApiBase } from "../env";
import UserIcon from "../icons/User";
import SidebarContent from "./content";
import SidebarHeader from "./hdr";

export const BackgroundImagesAvailable = [
    "https://images.pexels.com/photos/255377/pexels-photo-255377.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/112811/pexels-photo-112811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/19670/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/62693/pexels-photo-62693.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/751373/pexels-photo-751373.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
]

export default function SettingsTab() {

    const authCtx = useAuth();

    const handleLoginClick = (e) => {
        /** AssignID Login */
        window.location.assign(`${getApiBase()}/user`);
    }

    const handleResetClick = (e) => {
        let b = window.confirm("All shortkeys and settings will be deleted, are you sure?");
        if(b) {
            authCtx.resetGuestMode();
        }
    }

    const handleInstantLauncherChanged = (e) => {
        authCtx.changeSetting(SettingKey.instantLauncher, e.target.checked);
    }

    const handleAddNewShortkeyButton = (e) => {
        authCtx.changeSetting(SettingKey.addNewShortkeyButton, e.target.checked);
    }

    const handleSuggestions = (e) => {
        authCtx.changeSetting(SettingKey.suggestions, e.target.checked);
    }

    const handleHideProductHunt = (e) => {
        authCtx.changeSetting(SettingKey.hideProductHunt, e.target.checked);
    }

    const handleHideIcons = (e) => {
        authCtx.changeSetting(SettingKey.hideIcons, e.target.checked);
    }

    const handleMinimalistic = (e) => {
        authCtx.changeSetting(SettingKey.minimalistic, e.target.checked);
    }

    const handleEnableBackgroundPicture = (e) => {
        authCtx.changeSetting(SettingKey.enableBackgroundPicture, e.target.checked);
    }

    const handleBackgroundPicture = (bg) => (e) => {
        authCtx.changeSetting(SettingKey.backgroundPicture, bg);
    }

    return (
        <>
            <SidebarHeader />
            <SidebarContent>

                <>
                    <div
                        className="cW100p cFlex col jcenter acenter mb-20">
                            <UserIcon width={80} height={80} />
                            <span className="sidebarSettingsUserNameText">User</span>
                    </div>
                    <div
                        className="cW100p cFlex row jsb acenter">
                            <button onClick={handleLoginClick} className="btn t2 tc">
                                <span>
                                    Login
                                </span>
                            </button>
                            <button onClick={handleResetClick} className="btn t2 tc">
                                <span>
                                    Reset session
                                </span>
                            </button>
                    </div>
                    {/* <div
                        className="cW100p cFlex row jcenter acenter">
                        <button onClick={handleLoginClick} className="btn t2 tc">
                            <span>
                                Login
                            </span>
                        </button>
                    </div> */}
                </>

                <div className="cH40"></div>

                <CheckboxControl label={"Instant launcher"} onChange={handleInstantLauncherChanged} isChecked={authCtx.setting.instantLauncher} desc={"If there is a unique shortkey combination, it launches automatically."} />

                <div className="vS16"></div>

                <CheckboxControl label={"Suggestions"} onChange={handleSuggestions} isChecked={authCtx.setting.suggestions} desc={"Get a full list of options based on your input."} />

                <div className="vS16"></div>

                <CheckboxControl label={"Add new Shortkey"} onChange={handleAddNewShortkeyButton} isChecked={authCtx.setting.addNewShortkeyButton} desc={"If there is no match shortkey, you will be given a option to create new one."} />

                <div className="vS16"></div>

                {/* <CheckboxControl label={"Hide ProductHunt"} onChange={handleHideProductHunt} isChecked={authCtx.setting.hideProductHunt} desc={"Hide the ProductHunt button if you don't want to see it."} />

                <div className="vS16"></div> */}

                {/* <CheckboxControl label={"Minimalistic"} onChange={handleMinimalistic} isChecked={authCtx.setting.minimalistic} desc={"Hide all superfluous elements, including the logo on the start page."} />

                <div className="vS16"></div> */}

                {/* <CheckboxControl label={"Hide Icons"} onChange={handleHideIcons} isChecked={authCtx.setting.hideIcons} desc={"Hide icons from everywhere, include suggestions and collection list."} />

                <div className="vS16"></div> */}

                {/* <CheckboxControl label={"Background picture"} onChange={handleEnableBackgroundPicture} isChecked={authCtx.setting.enableBackgroundPicture} desc={"Use individual picture as desktop background."} />

                <div className="vS16"></div>

                {authCtx.setting.enableBackgroundPicture && <div
                    className="backgroundPictureContainer">

                        {BackgroundImagesAvailable.map((bg, x) => {
                            return (
                                <img key={`${x}`} onClick={handleBackgroundPicture(bg)} src={bg} className={(bg === authCtx.setting.backgroundPicture ? "selected" : "")} />
                            );
                        })}

                </div>} */}

                <div
                    className="cFlex row jsb acenter sidebarFooterContainer">
                        <a href="#">About</a>
                        <a href="#">Cookies</a>
                        <a href="#">Privacy</a>
                        <a href="#">Terms</a>
                        <a href="#">Tutorial</a>
                        <a href="#">Support</a>
                </div>

            </SidebarContent>
        </>
    );

}