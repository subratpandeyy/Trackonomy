import { Navigation } from "./navigation";
import { HeaderLogo } from "./header-logo";
import { WelcomeMsg } from "./welcome-msg";
import { Filters } from "../filters";
import { UserButtonWrapper } from "./user-button-wrapper";

export const Header = () =>{
    return(
        <header className="bg-gradient-to-b from-blue-700 to-blue-500 px-4 py-8 lg:px-14 pb-36">
            <div className="max-w-screen-2xl mx-auto">      {/*prevents header from expanding*/}
                <div className="w-full flex items-center justify-between mb-14">
                    <div className="flex items-center lg:gap-x-16">
                        <HeaderLogo />
                        <Navigation />
                    </div>
                    <UserButtonWrapper />
                    </div>
                    <WelcomeMsg />
                    <Filters />
                </div>
        </header>
    );
}