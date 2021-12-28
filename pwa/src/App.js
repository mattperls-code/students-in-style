import React from "react"

import { HashRouter, Routes, Route } from "react-router-dom"

import Auth from "./pages/Auth"
import AdminPanel from "./pages/AdminPanel"

const App = () => {
    return (
        <HashRouter>
            <Routes>
                <Route exact path={"/"} element={ <Auth /> } />
                <Route exact path={"/adminPanel"} element={ <AdminPanel /> } />
            </Routes>
        </HashRouter>
    )
}

export default App