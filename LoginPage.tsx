import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const users = [
    {name:"Lakshya",email:"lakshya@gmail.com",password:"password@123"},
    {name:"Imran Sir",email:"imran@gmail.com",password:"password@123"},
    {name:"Kartik Sir",email:"kartik@gmail.com",password:"password@123"}
  ];

  const handleSubmit = (e:React.FormEvent) => {
    e.preventDefault();

    const user = users.find(
      (u)=>u.email===email && u.password===password
    );

    if(user){
      localStorage.setItem("isLoggedIn","true");
      localStorage.setItem("user",JSON.stringify(user));
      navigate("/products");
    }else{
      alert("Invalid Credentials");
    }
  };

  return(
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Login
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border mb-4 rounded p-2"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter your password"
          className="w-full border mb-4 rounded p-2"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;