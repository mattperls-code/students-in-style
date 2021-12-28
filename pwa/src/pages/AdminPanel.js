import React, { useState, useEffect } from "react"

import { ACTIVE_LOGO, ALL_LOGOS, VALIDATE, ADD_LOGO } from "../routes"

const AdminPanel = () => {
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
                if(!data.result){
                    window.location.hash = "#/"
                }
            })
        } else {
            window.location.hash = "#/"
        }
    }, [])

    let [activeLogo, setActiveLogo] = useState(null)
    const updateActiveLogo = () => {
        fetch(ACTIVE_LOGO).then(res => res.json()).then(res => {
            setActiveLogo(res.data)
        })
    }

    let [uploadURL, setUploadURL] = useState("")

    let [allLogos, setAllLogos] = useState([])
    const updateAllLogos = () => {
        fetch(ALL_LOGOS).then(res => res.json()).then(res => {
            setAllLogos(res.data.reverse())
        })
    }

    useEffect(() => {
        updateActiveLogo()
        updateAllLogos()
    }, [])

    return (
        <div className={"pageContainer"}>
            <h1>Students In Style</h1>
            <h2>Admin Control Panel</h2>
            <section>
                <h3>Active Logo</h3>
                {
                    activeLogo && (
                        <img src={activeLogo} className={"activeLogoImage"} />
                    )
                }
            </section>
            <section style={{ backgroundColor: "black" }}>
                <h3>Upload New Logo</h3>
                <input type={"text"} placeholder={"New Logo URL"} onChange={(e) => {
                    setUploadURL(e.target.value)
                }} />
                <div style={{ backgroundColor: "rgb(30, 30, 30)" }} className={"submitButtonContainer"} onClick={() => {
                    const storedUser = JSON.parse(localStorage.getItem("sis-auth"))
                    fetch(ADD_LOGO, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            imgUrl: uploadURL,
                            username: storedUser.username,
                            hashedPassword: storedUser.password
                        })
                    }).then(res => res.json()).then(data => {
                        if(data.success){
                            updateActiveLogo()
                            updateAllLogos()
                        }
                    })
                }}>
                    <div className={"submitButtonText"}>Upload</div>
                </div>
            </section>
            <section>
                <h3>All Uploaded Logos</h3>
                <div className={"allLogosContainer"}>
                    {
                        (() => {
                            const logoRenders = []
                            allLogos.forEach((logo, index) => {
                                logoRenders.push(
                                    <div key={index} className={"logoImageContainer"}>
                                        <img height={"300"} src={logo} />
                                    </div>
                                )
                            })
                            return logoRenders
                        })()
                    }
                </div>
            </section>
            <section style={{ backgroundColor: "black" }}>
                <h3>Logout Of Admin Account</h3>
                <div style={{ backgroundColor: "rgb(30, 30, 30)" }} className={"submitButtonContainer"} onClick={() => {
                    localStorage.removeItem("sis-auth")
                    window.location.hash = "#/"
                }}>
                    <div className={"submitButtonText"}>Logout</div>
                </div>
            </section>
        </div>
    )
}


export default AdminPanel