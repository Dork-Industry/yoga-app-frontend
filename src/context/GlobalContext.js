import { createContext, useState } from "react";

const GlobalContext = createContext();
export default GlobalContext;

const GlobalProvider = ({ children }) => {
	const [loader, setLoader] = useState(false);
	
	return (
		<GlobalContext.Provider value={{
			loader, 
            setLoader
		}}>
			{children}
		</GlobalContext.Provider>
	)
};
export { GlobalProvider };