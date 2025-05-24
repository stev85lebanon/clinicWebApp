import React from 'react'
import { Link } from 'react-router-dom'

export default function Notfoundpage() {
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center text-center min-vh-100">
      <div className="display-1 fw-bold text-danger">404</div>
      <h2 className="mb-3">Ups! Siden blev ikke fundet</h2>
      <p className="text-muted mb-4">Den side, du leder efter, findes ikke eller er blevet flyttet.</p>
      <Link to="/" className="btn btn-primary">Tilbage til hjemside</Link>
    </div>
  )
}
