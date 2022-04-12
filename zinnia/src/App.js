// It should be linked to loginPage in the later version (after login system is done)
import Home from "./user/Home"
import LoginPage from "./login/LoginPage"
import Registration from "./login/Registration";
import ForgotPw from "./login/ForgetPw";
import ForgotPwSubmit from "./login/ForgetPwSubmit";
import AdminPage from "./admin/AdminPage"
import { BrowserRouter,Routes,Route} from "react-router-dom";
const App =() =>{
    return(
        <div style={{height: "auto", paddingBottom: "72.9vh"}}>
            <Routes>
                <Route path = '/' element = {<LoginPage />}/>
                <Route path ="/registration"element = {<Registration/>}/>
                <Route path ="/forgotPassword" element={<ForgotPw/>}/>
                <Route path ="/forgotPassword/:email/:token" element={<ForgotPwSubmit/>}/>
                <Route path = '/user/:userId/*' element = {<Home/>}/>
                <Route path = "/admin/*" element = {<AdminPage/>}/>
            </Routes>
        </div>
    );
};

export default App;