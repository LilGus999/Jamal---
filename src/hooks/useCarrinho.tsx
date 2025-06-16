import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ItemCarrinho {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
  categoria: string;
  descricao?: string;
}

interface CarrinhoContextType {
  itens: ItemCarrinho[];
  adicionarItem: (item: Omit<ItemCarrinho, 'quantidade'>) => void;
  removerItem: (id: string) => void;
  atualizarQuantidade: (id: string, quantidade: number) => void;
  limparCarrinho: () => void;
  total: number;
  quantidadeTotal: number;
}

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

export const useCarrinho = () => {
  const context = useContext(CarrinhoContext);
  if (!context) {
    throw new Error('useCarrinho deve ser usado dentro de um CarrinhoProvider');
  }
  return context;
};

interface CarrinhoProviderProps {
  children: ReactNode;
}

export const CarrinhoProvider: React.FC<CarrinhoProviderProps> = ({ children }) => {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);

  const adicionarItem = (novoItem: Omit<ItemCarrinho, 'quantidade'>) => {
    setItens(prevItens => {
      const itemExistente = prevItens.find(item => item.id === novoItem.id);
      
      if (itemExistente) {
        return prevItens.map(item =>
          item.id === novoItem.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      } else {
        return [...prevItens, { ...novoItem, quantidade: 1 }];
      }
    });
  };

  const removerItem = (id: string) => {
    setItens(prevItens => prevItens.filter(item => item.id !== id));
  };

  const atualizarQuantidade = (id: string, quantidade: number) => {
    if (quantidade <= 0) {
      removerItem(id);
      return;
    }

    setItens(prevItens =>
      prevItens.map(item =>
        item.id === id ? { ...item, quantidade } : item
      )
    );
  };

  const limparCarrinho = () => {
    setItens([]);
  };

  const total = itens.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  const quantidadeTotal = itens.reduce((acc, item) => acc + item.quantidade, 0);

  return (
    <CarrinhoContext.Provider
      value={{
        itens,
        adicionarItem,
        removerItem,
        atualizarQuantidade,
        limparCarrinho,
        total,
        quantidadeTotal,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
};

