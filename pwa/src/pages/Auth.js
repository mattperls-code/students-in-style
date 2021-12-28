import React, { useState, useRef, useEffect } from "react"

import { LOGIN, SIGNUP, VALIDATE } from "../routes"

const Auth = () => {
    let [failedAuth, setFailedAuth] = useState(false)
    let [username, setUsername] = useState("")
    let [password, setPassword] = useState("")
    let [adminKey, setAdminKey] = useState("")

    let usernameInput = useRef(null)
    let passwordInput = useRef(null)
    let adminKeyInput = useRef(null)
    
    let [currentPage, setCurrentPage] = useState("login")

    const updatePage = (newPage) => {
        setCurrentPage(newPage)
        setFailedAuth(false)
        setUsername("")
        setPassword("")
        setAdminKey("")
        usernameInput.current.value = ""
        passwordInput.current.value = ""
        if(currentPage == "signup"){
            adminKeyInput.current.value = ""
        }
    }

    useEffect(() => {
        if(Object.keys(localStorage).includes("sis-auth")){
            const storedUser = JSON.parse(localStorage.getItem("sis-auth"))
            fetch(VALIDATE, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: storedUser.username,
                    hashedPassword: storedUser.password
                })
            }).then(res => res.json()).then(data => {
                if(data.result){
                    window.location.hash = "#/adminPanel"
                }
            })
        }
    }, [])

    return (
        <div className={"pageContainer"}>
            <h1>Students In Style</h1>
            <h2>Admin Authentication</h2>
            <section>
                <h3>We need some authentication before you start breaking things</h3>
                {
                    currentPage == "login" ? (
                        <React.Fragment>
                            <input ref={usernameInput} type={"text"} placeholder={"Username"} onChange={(e) => {
                                setUsername(e.target.value)
                            }} />
                            <input ref={passwordInput} type={"password"} placeholder={"Password"} onChange={(e) => {
                                setPassword(e.target.value)
                            }} />
                            <div className={"submitButtonContainer"} onClick={() => {
                                fetch(LOGIN, {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        username,
                                        password
                                    })
                                }).then(res => res.json()).then(data => {
                                    if(data.result){
                                        setFailedAuth(false)
                                        localStorage.setItem("sis-auth", JSON.stringify(data.user))
                                        window.location.hash = "#/adminPanel"
                                    } else {
                                        setFailedAuth(true)
                                    }
                                })
                            }}>
                                <div className={"submitButtonText"}>Login</div>
                            </div>
                            <div className={"altAuthOption"} onClick={() => {
                                updatePage("signup")
                            }}>Signup instead</div>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <input ref={usernameInput} type={"text"} placeholder={"Username"} onChange={(e) => {
                                setUsername(e.target.value)
                            }} />
                            <input ref={passwordInput} type={"password"} placeholder={"Password"} onChange={(e) => {
                                setPassword(e.target.value)
                            }} />
                            <input ref={adminKeyInput} type={"password"} placeholder={"Admin Key"} onChange={(e) => {
                                setAdminKey(e.target.value)
                            }} />
                            <div className={"submitButtonContainer"} onClick={async () => {
                                fetch(`${SIGNUP}/${adminKey}`, {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        username,
                                        password
                                    })
                                }).then(res => res.json()).then(data => {
                                    if(data.success){
                                        setFailedAuth(false)
                                        localStorage.setItem("sis-auth", JSON.stringify(data.user))
                                        window.location.hash = "#/adminPanel"
                                    } else {
                                        setFailedAuth(true)
                                    }
                                })
                            }}>
                                <div className={"submitButtonText"}>Sign Up</div>
                            </div>
                            <div className={"altAuthOption"} onClick={() => {
                                updatePage("login")
                            }}>Login instead</div>
                        </React.Fragment>
                    )
                }
                {
                    failedAuth && (
                        <div className={"failedAuth"}>You sure about that one?</div>
                    )
                }
            </section>
        </div>
    )
}

export default Auth