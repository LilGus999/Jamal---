import React from 'react';
import ReactDOM from 'react-dom/client';
import { Layout } from './components/Layout';
import { CarrinhoProvider } from './hooks/useCarrinho';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CarrinhoProvider>
      <Layout />
    </CarrinhoProvider>
  </React.StrictMode>,
);
