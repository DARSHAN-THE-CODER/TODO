import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthFunctions";
import { Link, useHistory } from "react-router-dom";
import { auth } from "../firebase";
// import {updateProfile} from "firebase"
import axios from "axios";

export default function Signup() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const nameRef = useRef()
  const passwordConfirmRef = useRef()
  const {  signup ,updateProfile} = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  const handleKeypress = e => {
    //it triggers by pressing the enter key
  if (e.keyCode === 13) {
    handleSubmit();
  }};

  async function handleSubmit(e) {
    e.preventDefault()

    console.log(auth.currentUser);

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match")
    }

    try {
      setError("")
      setLoading(true)
      const z=await signup(emailRef.current.value, passwordRef.current.value)
      console.log(z);
      console.log(nameRef.current.value);
      const x= Object({uid:z.user.uid,email:z.user.email,name:nameRef.current.value});
      // await updateProfile(nameRef.current.value);
      console.log(x);
      axios(
        {
          method:'post',
          url:'/api/signup',
          data:x
        }
      )
      .then(function(res){
        console.log(res.data.message);
        console.log("added")
      })
      // .catch((err)=>{
      //   console.log(err);
      // })     
      console.log(z.user);
      console.log(z.user.email);
      console.log(z.user.uid);
      console.log(auth.currentUser);
      history.replace("/login");
    } catch (e){
      console.log(e);
        setError("Failed to create an account:"+e.message)
      // setError("Failed to create an account ")
    }
    setLoading(false)
  }
 

  return (
    <div style={{width:"100%",height:"100vh"}}>
      Say goodbye to all those post-it notes and hello to your new to-do list
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
          <hr style={{backgroundColor:"white"}}></hr>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit} onKeyPress={handleKeypress}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="name">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" ref={nameRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control type="password" ref={passwordConfirmRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Sign Up
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/login">Log In</Link>
      </div>
    </div>
  )
}
