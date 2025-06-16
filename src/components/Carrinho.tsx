import React, { useState } from 'react';
import { useCarrinho } from '../hooks/useCarrinho';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

export const Carrinho: React.FC = () => {
  const { itens, removerItem, atualizarQuantidade, limparCarrinho, total, quantidadeTotal } = useCarrinho();
  const [isOpen, setIsOpen] = useState(false);

  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(preco);
  };

  const finalizarPedido = () => {
    if (itens.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

    // Criar mensagem para WhatsApp
    let mensagem = 'Olá! Gostaria de fazer o seguinte pedido:\n\n';
    
    itens.forEach(item => {
      mensagem += `${item.quantidade}x ${item.nome} - ${formatarPreco(item.preco * item.quantidade)}\n`;
    });
    
    mensagem += `\nTotal: ${formatarPreco(total)}`;
    
    // Codificar a mensagem para URL
    const mensagemCodificada = encodeURIComponent(mensagem);
    
    // Número do WhatsApp da esfiharia (substitua pelo número real)
    const numeroWhatsApp = '5511987654321';
    
    // Abrir WhatsApp
    window.open(`https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`, '_blank');
    
    // Limpar carrinho após enviar
    limparCarrinho();
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {quantidadeTotal > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {quantidadeTotal}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Carrinho de Compras</SheetTitle>
          <SheetDescription>
            {quantidadeTotal > 0 
              ? `${quantidadeTotal} ${quantidadeTotal === 1 ? 'item' : 'itens'} no carrinho`
              : 'Seu carrinho está vazio'
            }
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {itens.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Seu carrinho está vazio</p>
              <p className="text-sm text-gray-400">Adicione alguns itens do cardápio</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {itens.map((item) => (
                  <Card key={item.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.nome}</h4>
                        <p className="text-xs text-gray-500">{item.categoria}</p>
                        <p className="text-sm font-semibold text-green-600">
                          {formatarPreco(item.preco)}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => atualizarQuantidade(item.id, item.quantidade - 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantidade}
                        </span>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => atualizarQuantidade(item.id, item.quantidade + 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removerItem(item.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-right">
                      <span className="text-sm font-semibold">
                        Subtotal: {formatarPreco(item.preco * item.quantidade)}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-lg font-bold text-green-600">
                    {formatarPreco(total)}
                  </span>
                </div>

                <div className="space-y-2">
                  <Button 
                    onClick={finalizarPedido}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    Finalizar Pedido via WhatsApp
                  </Button>
                  
                  <Button 
                    onClick={limparCarrinho}
                    variant="outline"
                    className="w-full"
                  >
                    Limpar Carrinho
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

