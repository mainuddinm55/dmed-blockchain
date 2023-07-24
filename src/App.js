import "./App.css";

import IpfsUpload from "./components/IpfsUpload";
import Login from "./components/Login";
import SignUp from "./components/SignUp";

function App() {
  return (
    <div className="App">
      <SignUp userType={"USER"} />
      <Login />
      <IpfsUpload />
    </div>
  );
}
export default App;
