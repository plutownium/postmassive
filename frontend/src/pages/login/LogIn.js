import React, { useState } from "react";

import Form from "react-bootstrap/Form";

import Button from "react-bootstrap/Button";

import Logo from "../../images/gps-searching.png";

import "./LogIn.scss";

import { handleAddUsernameOrEmail } from "../../loginTools/util";
import { validPassword } from "../../loginTools/Validation";

function LogIn(props) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handlePassword = (pass) => {
        // validates password and sets pw if it is valid so its ready to be sent to server
        console.log(pass.target.value, validPassword(pass.target.value));
        if (validPassword(pass.target.value)) {
            setPassword(pass.target.value);
        }
    };

    return (
        <div>
            <div id="log-in_main">
                <div id="log-in_container">
                    <div id="log-in_logo-container">
                        <img src={Logo} alt="PostMassiv Logo" />
                    </div>
                    <div id="log-in_headline-container">
                        <h1>Log in to PostMassiv</h1>
                    </div>
                    <div id="log-in_input-container">
                        <Form>
                            <Form.Label htmlFor="log-in_email-input">
                                Email
                            </Form.Label>
                            <Form.Control
                                type="email"
                                id="log-in_email-input"
                                placeholder="Your email"
                                aria-describedby="emailHelpBlock"
                                onChange={(value) =>
                                    handleAddUsernameOrEmail(
                                        value.target.value,
                                        setUsername,
                                        setEmail
                                    )
                                }
                            />
                            <Form.Label htmlFor="log-in_password-input">
                                Password
                            </Form.Label>
                            <Form.Control
                                type="password"
                                id="log-in_password-input"
                                placeholder="Your password"
                                aria-describedby="passwordHelpBlock"
                                onChange={(value) => handlePassword(value)}
                            />
                            <Button>Log in</Button>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LogIn;
