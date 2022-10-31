import { Home } from './pages/home';
import { BrowserRouter, Routes, Route } from "react-router-dom";
export function App() {
    return (
        <div className="container">
            <div className="py-5">
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home />} />
                    </Routes>
                </BrowserRouter>
            </div>
        </div>

    );
}
