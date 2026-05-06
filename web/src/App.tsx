import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Admin } from "./screens/Admin";
import { Display } from "./screens/Display";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Display />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
