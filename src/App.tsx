import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout"
import Products from "./pages/Products";
import CreateProduct from "./pages/CreateProduct";
import LoginPage from "./pages/LoginPage";

function App(){
  return (
    <BrowserRouter>
      <Layout>
      <Routes>
        <Route path="/" element={<LoginPage />} /> 
        <Route path="/products" element={<Products />} />
        <Route path="/product/create" element={<CreateProduct />} />
        <Route path="/product/edit/:id" element={<CreateProduct />} />
      </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
