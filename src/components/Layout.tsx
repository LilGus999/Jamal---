import React, { useState, useEffect } from 'react';
import { Catalogo } from './Catalogo';
import { Carrinho } from './Carrinho';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Menu, Phone, MessageCircle, ShoppingBag, Store, MapPin, Clock, Mail, Facebook, Instagram } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

export const Layout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsHeaderScrolled(true);
      } else {
        setIsHeaderScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - (isHeaderScrolled ? 64 : 0), // Ajuste para o header fixo
        behavior: 'smooth',
      });
    }
    setIsMenuOpen(false);
  };

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Obrigado por sua mensagem! Entraremos em contato em breve.');
    (e.target as HTMLFormElement).reset();
  };

  const handleSubmitNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Obrigado por se inscrever em nossa newsletter!');
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <header className={`fixed w-full z-50 bg-white bg-opacity-95 ${isHeaderScrolled ? 'shadow-md bg-opacity-98' : ''} transition-all duration-300`}>
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <a href="#" className="text-3xl font-bold text-red-800" style={{ fontFamily: 'Pacifico, cursive' }}>
            Esfiharia Jamal
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button onClick={() => scrollToSection('inicio')} className="text-gray-800 hover:text-red-800 font-medium transition">
              Início
            </button>
            <button onClick={() => scrollToSection('cardapio')} className="text-gray-800 hover:text-red-800 font-medium transition">
              Cardápio
            </button>
            <button onClick={() => scrollToSection('sobre')} className="text-gray-800 hover:text-red-800 font-medium transition">
              Sobre Nós
            </button>
            <button onClick={() => scrollToSection('contato')} className="text-gray-800 hover:text-red-800 font-medium transition">
              Contato
            </button>
            <button onClick={() => scrollToSection('pedido')} className="bg-red-800 text-white px-4 py-2 rounded font-medium hover:bg-red-700 transition">
              Peça Agora
            </button>
          </nav>

          {/* Mobile Menu and Cart */}
          <div className="flex items-center space-x-2">
            <Carrinho />
            
            {/* Mobile Menu */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-6">
                  <button onClick={() => scrollToSection('inicio')} className="text-left text-gray-800 hover:text-red-800 font-medium transition">
                    Início
                  </button>
                  <button onClick={() => scrollToSection('cardapio')} className="text-left text-gray-800 hover:text-red-800 font-medium transition">
                    Cardápio
                  </button>
                  <button onClick={() => scrollToSection('sobre')} className="text-left text-gray-800 hover:text-red-800 font-medium transition">
                    Sobre Nós
                  </button>
                  <button onClick={() => scrollToSection('contato')} className="text-left text-gray-800 hover:text-red-800 font-medium transition">
                    Contato
                  </button>
                  <button onClick={() => scrollToSection('pedido')} className="text-left bg-red-800 text-white px-4 py-2 rounded font-medium hover:bg-red-700 transition">
                    Peça Agora
                  </button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="min-h-screen flex items-center pt-16 bg-gradient-to-r from-black/50 to-black/50 bg-cover bg-center" 
               style={{ backgroundImage: "url('https://readdy.ai/api/search-image?query=Traditional%2520Arabic%2520esfihas%2520on%2520a%2520wooden%2520table%2520with%2520fresh%2520ingredients%2520around%252C%2520beautifully%2520arranged%2520with%2520some%2520herbs%2520and%2520spices.%2520The%2520left%2520side%2520has%2520a%2520gradient%2520that%2520fades%2520to%2520a%2520clean%2520background%2520for%2520text%2520placement.%2520The%2520right%2520side%2520shows%2520delicious%2520food%2520details.%2520High-quality%2520food%2520photography.&width=1600&height=800&seq=1&orientation=landscape')" }}>
        <div className="container mx-auto px-4 py-20 w-full">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight font-serif">
              Esfiharia Jamal
            </h1>
            <p className="text-xl text-white mb-8 opacity-90">
              Feita à mão, servida com orgulho
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => scrollToSection('pedido')}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 text-lg"
              >
                Peça Agora
              </Button>
              <Button 
                onClick={() => scrollToSection('cardapio')}
                variant="outline"
                className="bg-white/20 backdrop-blur-sm text-white border-white/40 px-8 py-3 text-lg hover:bg-white/30"
              >
                Ver Cardápio
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Destaques Section */}
      <section className="py-20 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3 font-serif">Nossos Destaques</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Conheça nossas esfihas mais pedidas, preparadas com ingredientes frescos e receitas tradicionais árabes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Destaque 1 */}
            <Card className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-64 overflow-hidden">
                <img 
                  src="https://readdy.ai/api/search-image?query=Delicious%2520traditional%2520meat%2520esfiha%2520with%2520minced%2520beef%2C%2520tomatoes%252C%2520and%2520spices.%2520Top-down%2520view%2520of%2520an%2520open-faced%2520esfiha%2520on%2520a%2520rustic%2520wooden%2520board%2520with%2520some%2520fresh%2520herbs%2520garnish.%2520High-quality%2520food%2520photography%2520with%2520natural%2520lighting.&width=600&height=400&seq=2&orientation=landscape" 
                  alt="Esfiha de Carne" 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 font-serif">Esfiha de Carne</h3>
                <p className="text-gray-600 mb-4">Nossa tradicional esfiha de carne moída temperada com cebola e tomate.</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-red-800">R$ 7,90</span>
                  <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
                    Adicionar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Destaque 2 */}
            <Card className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-64 overflow-hidden">
                <img 
                  src="https://readdy.ai/api/search-image?query=Delicious%2520cheese%2520esfiha%2520with%2520melted%2520mozzarella%2520and%2520white%2520cheese%2C%2520topped%2520with%2520a%2520sprinkle%2520of%2520oregano.%2520Top-down%2520view%2520of%2520an%2520open-faced%2520esfiha%2520on%2520a%2520rustic%2520wooden%2520board.%2520High-quality%2520food%2520photography%2520with%2520natural%2520lighting.&width=600&height=400&seq=3&orientation=landscape" 
                  alt="Esfiha de Queijo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 font-serif">Esfiha de Queijo</h3>
                <p className="text-gray-600 mb-4">Deliciosa combinação de queijos derretidos com um toque de orégano fresco.</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-red-800">R$ 8,50</span>
                  <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
                    Adicionar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Destaque 3 */}
            <Card className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-64 overflow-hidden">
                <img 
                  src="https://readdy.ai/api/search-image?query=Delicious%2520chocolate%2520and%2520banana%2520sweet%2520esfiha%2520with%2520melted%2520chocolate%2520and%2520banana%2520slices.%2520Top-down%2520view%2520of%2520an%2520open-faced%2520sweet%2520esfiha%2520on%2520a%2520rustic%2520wooden%2520board%2520with%2520some%2520chocolate%2520drizzle.%2520High-quality%2520food%2520photography%2520with%2520natural%2520lighting.&width=600&height=400&seq=4&orientation=landscape" 
                  alt="Esfiha Doce" 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 font-serif">Esfiha de Chocolate</h3>
                <p className="text-gray-600 mb-4">Nossa versão doce com chocolate cremoso e banana, finalizada com canela.</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-red-800">R$ 9,90</span>
                  <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
                    Adicionar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="text-center mt-12">
            <Button 
              onClick={() => scrollToSection('cardapio')}
              variant="link"
              className="text-red-800 font-medium hover:text-red-600"
            >
              Ver cardápio completo →
            </Button>
          </div>
        </div>
      </section>

      {/* Catálogo */}
      <Catalogo />

      {/* Sobre Nós Section */}
      <section id="sobre" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img 
                src="https://readdy.ai/api/search-image?query=Traditional%2520Middle%2520Eastern%2520kitchen%2520with%2520a%2520chef%2520preparing%2520esfihas%2520by%2520hand%252C%2520showing%2520the%2520artisanal%2520process%2520of%2520making%2520Arabic%2520food.%2520Warm%2520lighting%252C%2520traditional%2520ingredients%2520and%2520tools%2520visible.&width=600&height=500&seq=16&orientation=landscape" 
                alt="Sobre a Esfiharia Jamal" 
                className="rounded-lg shadow-xl w-full"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-4xl font-bold text-gray-900 mb-6 font-serif">Sobre Nós</h2>
              <p className="text-gray-600 mb-6">
                A Esfiharia Jamal nasceu em 2010 com o sonho de trazer os autênticos sabores da culinária árabe para São Paulo. 
                Fundada pela família Jamal, que trouxe receitas tradicionais passadas de geração em geração.
              </p>
              <p className="text-gray-600 mb-6">
                Cada esfiha é preparada artesanalmente, com ingredientes frescos e selecionados. Nossa massa é feita diariamente 
                e nossos recheios seguem as receitas originais do Líbano, adaptadas ao paladar brasileiro.
              </p>
              <p className="text-gray-600 mb-6">
                Mais do que uma esfiharia, somos um pedacinho do Oriente Médio no coração de São Paulo, onde cada cliente 
                é recebido como família.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-800">15+</div>
                  <div className="text-gray-600">Anos de tradição</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-800">50k+</div>
                  <div className="text-gray-600">Clientes satisfeitos</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pedido Section */}
      <section id="pedido" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img 
                src="https://readdy.ai/api/search-image?query=Middle%2520Eastern%2520food%2520delivery%2520concept.%2520A%2520smartphone%2520with%2520a%2520food%2520delivery%2520app%2520showing%2520esfihas%2520and%2520Arabic%2520food%2C%2520next%2520to%2520a%2520delivery%2520bag%2520with%2520some%2520packaged%2520food.%2520Clean%2C%2520modern%2520composition%2520on%2520a%2520light%2520background.&width=600&height=500&seq=15&orientation=landscape" 
                alt="Faça seu pedido" 
                className="rounded-lg shadow-xl w-full"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-4xl font-bold text-gray-900 mb-6 font-serif">Faça seu Pedido</h2>
              <p className="text-gray-600 mb-6">
                Escolha a forma mais conveniente para você receber nossas deliciosas esfihas:
              </p>
              <div className="space-y-6">
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <MessageCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">WhatsApp</h3>
                      <p className="text-sm text-gray-600">Peça diretamente pelo nosso WhatsApp</p>
                    </div>
                    <Button 
                      onClick={() => window.open('https://wa.me/5511987654321', '_blank')}
                      variant="outline"
                      className="text-green-600 border-green-600 hover:bg-green-50"
                    >
                      Pedir
                    </Button>
                  </div>
                </Card>

                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <Phone className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">Telefone</h3>
                      <p className="text-sm text-gray-600">Ligue para nós e faça seu pedido</p>
                    </div>
                    <Button 
                      onClick={() => window.open('tel:+551134567890')}
                      variant="outline"
                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                    >
                      Ligar
                    </Button>
                  </div>
                </Card>

                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                      <ShoppingBag className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">iFood</h3>
                      <p className="text-sm text-gray-600">Peça pelo aplicativo iFood</p>
                    </div>
                    <Button 
                      onClick={() => window.open('https://www.ifood.com.br/delivery/sao-paulo-sp/esfiharia-jamal-centro', '_blank')}
                      variant="outline"
                      className="text-purple-600 border-purple-600 hover:bg-purple-50"
                    >
                      Pedir
                    </Button>
                  </div>
                </Card>

                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                      <Store className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">Retirada na Loja</h3>
                      <p className="text-sm text-gray-600">Faça seu pedido e retire em nossa loja</p>
                    </div>
                    <Button 
                      onClick={() => scrollToSection('contato')}
                      variant="outline"
                      className="text-orange-600 border-orange-600 hover:bg-orange-50"
                    >
                      Ver Endereço
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contato Section */}
      <section id="contato" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3 font-serif">Fale Conosco</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Entre em contato conosco para dúvidas, sugestões ou pedidos especiais.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <form onSubmit={handleSubmitContact} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Nome</label>
                  <input type="text" id="name" name="name" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800" required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                  <input type="email" id="email" name="email" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800" required />
                </div>
                <div>
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Mensagem</label>
                  <textarea id="message" name="message" rows={5} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800" required></textarea>
                </div>
                <Button type="submit" className="w-full bg-red-800 hover:bg-red-700 text-white py-3 text-lg">
                  Enviar Mensagem
                </Button>
              </form>
            </div>
            <div>
              <div className="space-y-6">
                <div className="flex items-center">
                  <MapPin className="h-8 w-8 text-red-800 mr-4" />
                  <div>
                    <h3 className="font-medium text-gray-900">Endereço</h3>
                    <p className="text-gray-600">Rua das Esfihas, 123 - Centro, São Paulo - SP</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="h-8 w-8 text-red-800 mr-4" />
                  <div>
                    <h3 className="font-medium text-gray-900">Telefone</h3>
                    <p className="text-gray-600">(11) 3456-7890</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="h-8 w-8 text-red-800 mr-4" />
                  <div>
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <p className="text-gray-600">contato@esfihariajamal.com.br</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-red-800 mr-4" />
                  <div>
                    <h3 className="font-medium text-gray-900">Horário de Funcionamento</h3>
                    <p className="text-gray-600">Seg-Sáb: 11h - 23h | Dom: 12h - 22h</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Siga-nos nas Redes Sociais</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-600 hover:text-red-800 transition">
                    <Facebook className="h-8 w-8" />
                  </a>
                  <a href="#" className="text-gray-600 hover:text-red-800 transition">
                    <Instagram className="h-8 w-8" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-red-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Receba Nossas Novidades!</h2>
          <p className="text-lg mb-8">Inscreva-se em nossa newsletter e fique por dentro das promoções e novos sabores.</p>
          <form onSubmit={handleSubmitNewsletter} className="max-w-md mx-auto flex gap-4">
            <input 
              type="email" 
              placeholder="Seu melhor email" 
              className="flex-1 p-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-600"
              required 
            />
            <Button type="submit" className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 text-lg">
              Inscrever-se
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Esfiharia Jamal. Todos os direitos reservados.</p>
          <p className="text-sm mt-2">Desenvolvido com paixão pela culinária árabe.</p>
        </div>
      </footer>
    </div>
  );
};


