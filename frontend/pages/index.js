import React from 'react';
import AccountForm from '../components/AccountForm';
import '../styles/globals.scss';

export default function Home() {
  return (
    <main className="container">
      <h1>Abra uma nova conta</h1>
      <AccountForm />
    </main>
  );
}