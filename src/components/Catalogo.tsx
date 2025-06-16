import React, { useState } from 'react';
import { useCarrinho } from '../hooks/useCarrinho';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Plus } from 'lucide-react';

interface Esfiha {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  imagem: string;
}

const esfihas: Esfiha[] = [
  {
    id: '1',
    nome: 'Esfiha de Carne Tradicional',
    descricao: 'Carne moída temperada com cebola, tomate e hortelã.',
    preco: 7.90,
    categoria: 'carne',
    imagem: 'https://readdy.ai/api/search-image?query=Traditional%2520meat%2520esfiha%2520with%2520minced%2520beef%2C%2520tomatoes%2C%2520and%2520middle%2520eastern%2520spices.%2520Top-down%2520view%2520of%2520an%2520open-faced%2520esfiha%2520on%2520a%2520rustic%2520wooden%2520board.%2520High-quality%2520food%2520photography%2520with%2520natural%2520lighting.&width=500&height=300&seq=6&orientation=landscape'
  },
  {
    id: '2',
    nome: 'Esfiha de Carne Especial',
    descricao: 'Carne moída premium com pinoli, romã e molho tahine.',
    preco: 9.90,
    categoria: 'carne',
    imagem: 'https://readdy.ai/api/search-image?query=Lebanese%2520esfiha%2520with%2520minced%2520beef%2C%2520pine%2520nuts%2C%2520and%2520pomegranate%2520seeds.%2520Top-down%2520view%2520of%2520an%2520open-faced%2520esfiha%2520on%2520a%2520rustic%2520wooden%2520board.%2520High-quality%2520food%2520photography%2520with%2520natural%2520lighting.&width=500&height=300&seq=7&orientation=landscape'
  },
  {
    id: '3',
    nome: 'Esfiha de Frango',
    descricao: 'Frango desfiado temperado com ervas frescas e um toque de limão.',
    preco: 8.50,
    categoria: 'frango',
    imagem: 'https://readdy.ai/api/search-image?query=Chicken%2520esfiha%2520with%2520shredded%2520chicken%2C%2520corn%2C%2520and%2520cream%2520cheese.%2520Top-down%2520view%2520of%2520an%2520open-faced%2520esfiha%2520on%2520a%2520rustic%2520wooden%2520board.%2520High-quality%2520food%2520photography%2520with%2520natural%2520lighting.&width=500&height=300&seq=8&orientation=landscape'
  },
  {
    id: '4',
    nome: 'Frango com Catupiry',
    descricao: 'Frango desfiado com o autêntico queijo cremoso brasileiro.',
    preco: 9.50,
    categoria: 'frango',
    imagem: 'https://readdy.ai/api/search-image?query=Chicken%2520with%2520catupiry%2520cheese%2520esfiha.%2520Top-down%2520view%2520of%2520an%2520open-faced%2520esfiha%2520with%2520melted%2520cheese%2520on%2520a%2520rustic%2520wooden%2520board.%2520High-quality%2520food%2520photography%2520with%2520natural%2520lighting.&width=500&height=300&seq=9&orientation=landscape'
  },
  {
    id: '5',
    nome: 'Quatro Queijos',
    descricao: 'Blend especial de mussarela, parmesão, gorgonzola e catupiry.',
    preco: 9.90,
    categoria: 'queijo',
    imagem: 'https://readdy.ai/api/search-image?query=Four%2520cheese%2520esfiha%2520with%2520mozzarella%2C%2520cheddar%2C%2520parmesan%2C%2520and%2520cream%2520cheese.%2520Top-down%2520view%2520of%2520an%2520open-faced%2520esfiha%2520with%2520melted%2520cheese%2520on%2520a%2520rustic%2520wooden%2520board.%2520High-quality%2520food%2520photography%2520with%2520natural%2520lighting.&width=500&height=300&seq=10&orientation=landscape'
  },
  {
    id: '6',
    nome: 'Espinafre com Queijo',
    descricao: 'Espinafre fresco refogado com queijo feta e pinoli.',
    preco: 8.90,
    categoria: 'vegetariana',
    imagem: 'https://readdy.ai/api/search-image?query=Vegetarian%2520esfiha%2520with%2520spinach%2C%2520feta%2520cheese%2C%2520and%2520pine%2520nuts.%2520Top-down%2520view%2520of%2520an%2520open-faced%2520esfiha%2520on%2520a%2520rustic%2520wooden%2520board.%2520High-quality%2520food%2520photography%2520with%2520natural%2520lighting.&width=500&height=300&seq=11&orientation=landscape'
  },
  {
    id: '7',
    nome: 'Berinjela Mediterrânea',
    descricao: 'Berinjela assada com tahine, romã e hortelã fresca.',
    preco: 8.90,
    categoria: 'vegetariana',
    imagem: 'https://readdy.ai/api/search-image?query=Mediterranean%2520vegetarian%2520esfiha%2520with%2520roasted%2520eggplant%2C%2520tahini%2C%2520and%2520pomegranate%2520seeds.%2520Top-down%2520view%2520of%2520an%2520open-faced%2520esfiha%2520on%2520a%2520rustic%2520wooden%2520board.%2520High-quality%2520food%2520photography%2520with%2520natural%2520lighting.&width=500&height=300&seq=12&orientation=landscape'
  },
  {
    id: '8',
    nome: 'Nutella com Morango',
    descricao: 'Creme de avelã com fatias de morango fresco.',
    preco: 10.90,
    categoria: 'doce',
    imagem: 'https://readdy.ai/api/search-image?query=Sweet%2520esfiha%2520with%2520Nutella%2520and%2520strawberries.%2520Top-down%2520view%2520of%2520an%2520open-faced%2520sweet%2520esfiha%2520with%2520chocolate%2520spread%2520and%2520fresh%2520strawberry%2520slices%2520on%2520a%2520rustic%2520wooden%2520board.%2520High-quality%2520food%2520photography%2520with%2520natural%2520lighting.&width=500&height=300&seq=13&orientation=landscape'
  },
  {
    id: '9',
    nome: 'Banana com Canela',
    descricao: 'Banana caramelizada com mel, canela e um toque de limão.',
    preco: 9.90,
    categoria: 'doce',
    imagem: 'https://readdy.ai/api/search-image?query=Sweet%2520esfiha%2520with%2520banana%2C%2520cinnamon%2C%2520and%2520honey.%2520Top-down%2520view%2520of%2520an%2520open-faced%2520sweet%2520esfiha%2520with%2520caramelized%2520banana%2520slices%2520on%2520a%2520rustic%2520wooden%2520board.%2520High-quality%2520food%2520photography%2520with%2520natural%2520lighting.&width=500&height=300&seq=14&orientation=landscape'
  }
];

const categorias = [
  { id: 'todos', nome: 'Todos' },
  { id: 'carne', nome: 'Carne' },
  { id: 'frango', nome: 'Frango' },
  { id: 'queijo', nome: 'Queijo' },
  { id: 'vegetariana', nome: 'Vegetariana' },
  { id: 'doce', nome: 'Doce' }
];

export const Catalogo: React.FC = () => {
  const [categoriaAtiva, setCategoriaAtiva] = useState('todos');
  const { adicionarItem } = useCarrinho();

  const esfihasFiltradas = categoriaAtiva === 'todos' 
    ? esfihas 
    : esfihas.filter(esfiha => esfiha.categoria === categoriaAtiva);

  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(preco);
  };

  const handleAdicionarAoCarrinho = (esfiha: Esfiha) => {
    adicionarItem({
      id: esfiha.id,
      nome: esfiha.nome,
      preco: esfiha.preco,
      categoria: esfiha.categoria,
      descricao: esfiha.descricao
    });
  };

  return (
    <section id="cardapio" className="py-20 bg-amber-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3 font-serif">Nosso Cardápio</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Conheça nossas deliciosas opções de esfihas especiais.
          </p>
        </div>

        {/* Filtros */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white rounded-full p-1 shadow-md flex-wrap">
            {categorias.map((categoria) => (
              <Button
                key={categoria.id}
                variant={categoriaAtiva === categoria.id ? "default" : "ghost"}
                className={`px-6 py-2 rounded-full whitespace-nowrap ${
                  categoriaAtiva === categoria.id 
                    ? 'bg-red-800 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setCategoriaAtiva(categoria.id)}
              >
                {categoria.nome}
              </Button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {esfihasFiltradas.map((esfiha) => (
            <Card key={esfiha.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden">
                <img 
                  src={esfiha.imagem} 
                  alt={esfiha.nome}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900 text-lg font-serif">
                    {esfiha.nome}
                  </h3>
                  <Badge variant="secondary" className="ml-2">
                    {esfiha.categoria}
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  {esfiha.descricao}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-red-800">
                    {formatarPreco(esfiha.preco)}
                  </span>
                  <Button 
                    onClick={() => handleAdicionarAoCarrinho(esfiha)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

